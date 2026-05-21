import { useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  Pill,
  CreditCard,
  HeartHandshake,
  Tag,
  Gift,
  ExternalLink,
  Phone,
  AlertCircle,
} from 'lucide-react';
import liverData from '../data/liver_conditions.json';
import { useMetaTags } from '../hooks/useMetaTags';
import { seoMetadata } from '../data/seo-metadata';

const PROGRAM_SECTIONS = [
  {
    key: 'copay_cards',
    label: 'Copay Cards',
    blurb: 'Manufacturer cards that reduce out-of-pocket cost. Commercial insurance usually required.',
    Icon: CreditCard,
    accent: 'border-coral/40 bg-coral/5',
    chip: 'bg-coral/10 text-coral',
  },
  {
    key: 'patient_assistance',
    label: 'Patient Assistance Programs (PAPs)',
    blurb: 'Manufacturer programs for uninsured or underinsured patients. Income limits typically apply.',
    Icon: HeartHandshake,
    accent: 'border-navy/15 bg-navy/[0.03]',
    chip: 'bg-navy/10 text-navy',
  },
  {
    key: 'discount_programs',
    label: 'Discount Programs',
    blurb: 'Third-party or pharmacy discount cards. Usable with or without insurance.',
    Icon: Tag,
    accent: 'border-navy/15 bg-white',
    chip: 'bg-navy/5 text-navy',
  },
  {
    key: 'free_trials',
    label: 'Free Trial Programs',
    blurb: 'Time-limited free supply offers, typically for new starts.',
    Icon: Gift,
    accent: 'border-navy/15 bg-white',
    chip: 'bg-navy/5 text-navy',
  },
];

function formatVerified(iso) {
  if (!iso) return null;
  try {
    return new Date(iso).toLocaleDateString(undefined, { year: 'numeric', month: 'short' });
  } catch {
    return null;
  }
}

function ProgramCard({ program }) {
  const verified = formatVerified(program.last_verified);
  return (
    <li className="rounded-lg border border-navy/10 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h5 className="font-semibold text-navy">{program.program_name || 'Unnamed program'}</h5>
        {program.max_savings && (
          <span className="text-sm font-medium text-navy/70">{program.max_savings}</span>
        )}
      </div>

      {program.eligibility && (
        <p className="mt-2 text-sm text-navy/72">
          <span className="font-medium text-navy">Eligibility: </span>
          {program.eligibility}
        </p>
      )}

      {program.notes && (
        <p className="mt-2 text-sm text-navy/72">{program.notes}</p>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        {program.application_url && (
          <a
            href={program.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-medium text-coral hover:underline"
          >
            Apply / Learn more <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
          </a>
        )}
        {program.phone_number && (
          <a
            href={`tel:${program.phone_number.replace(/[^0-9+]/g, '')}`}
            className="inline-flex items-center gap-1 text-navy hover:underline"
          >
            <Phone className="h-3.5 w-3.5" aria-hidden="true" />
            {program.phone_number}
          </a>
        )}
        {verified && (
          <span className="text-xs text-navy/50">Verified {verified}</span>
        )}
      </div>
    </li>
  );
}

function ProgramSection({ section, programs }) {
  const { Icon, label, blurb, accent, chip } = section;
  const count = programs.length;
  return (
    <section
      aria-label={label}
      className={`rounded-xl border ${accent} p-4 sm:p-5`}
    >
      <header className="flex items-start gap-3">
        <span className={`inline-flex h-9 w-9 flex-none items-center justify-center rounded-full ${chip}`}>
          <Icon className="h-5 w-5" aria-hidden="true" />
        </span>
        <div className="min-w-0">
          <h4 className="text-base font-semibold text-navy">
            {label}
            <span className="ml-2 text-sm font-normal text-navy/50">({count})</span>
          </h4>
          <p className="mt-0.5 text-sm text-navy/60">{blurb}</p>
        </div>
      </header>

      {count === 0 ? (
        <p className="mt-3 text-sm italic text-navy/50">
          No {label.toLowerCase()} on file for this medication.
        </p>
      ) : (
        <ul className="mt-4 space-y-3">
          {programs.map((p) => (
            <ProgramCard key={p.id} program={p} />
          ))}
        </ul>
      )}
    </section>
  );
}

// Decide which name to lead with so the heading is clinically accurate:
// when a widely-used generic exists, the generic is more useful as the
// primary (Prednisone, not Deltasone). When the brand is the only real
// name (Livmarli, Bylvay), the brand stays primary. The *other* name is
// always returned so we can render both at near-equal weight -- patients
// recognize whichever one their pharmacy / doctor uses.
function displayNames(med) {
  const generic = (med.generic_name || '').trim();
  const brand = (med.brand_name || '').trim();
  const capitalize = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);
  const sameish = (a, b) => a && b && a.toLowerCase() === b.toLowerCase();

  if (med.has_generic === true && generic) {
    return {
      primary: capitalize(generic),
      primaryLabel: 'Generic',
      secondary: !sameish(brand, generic) ? brand : null,
      secondaryLabel: 'Brand',
    };
  }
  return {
    primary: brand || capitalize(generic),
    primaryLabel: 'Brand',
    secondary: brand && generic && !sameish(brand, generic) ? capitalize(generic) : null,
    secondaryLabel: 'Generic',
  };
}

function MedicationBlock({ med }) {
  const { primary, primaryLabel, secondary, secondaryLabel } = displayNames(med);
  return (
    <article className="overflow-hidden rounded-2xl border-2 border-navy/15 bg-white shadow-sm">
      {/* Medication header: visually distinct band so the drug name doesn't
          compete with the four program section headers below. Both the
          generic and the brand are shown -- equal weight as names, with
          small labels so patients can pick the one they know. */}
      <header className="border-b border-navy/10 bg-navy/[0.04] px-5 py-4 sm:px-6 sm:py-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded bg-navy/10 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-navy/70">
                {primaryLabel}
              </span>
              <h3 className="text-2xl font-bold leading-tight text-navy">{primary}</h3>
            </div>
            {secondary && (
              <div className="mt-1 flex items-center gap-2">
                <span className="rounded bg-coral/15 px-1.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-coral">
                  {secondaryLabel}
                </span>
                <p className="text-lg font-semibold text-navy/80">{secondary}</p>
              </div>
            )}
            <p className="mt-2 text-sm text-navy/60">
              {med.manufacturer && <span>{med.manufacturer}</span>}
              {med.manufacturer && med.drug_class && <span> &middot; </span>}
              {med.drug_class && <span>{med.drug_class}</span>}
            </p>
          </div>
          {med.has_generic && (
            <span className="rounded-full bg-navy/10 px-2.5 py-1 text-xs font-medium text-navy">
              Generic available
            </span>
          )}
        </div>
      </header>

      <div className="px-5 py-5 sm:px-6 sm:py-6">
        {med.typical_cost_range && (
          <p className="text-sm text-navy/72">
            <span className="font-medium text-navy">Typical cost: </span>
            {med.typical_cost_range}
          </p>
        )}
        {med.notes && (
          <p className="mt-2 text-sm text-navy/72">{med.notes}</p>
        )}

        <h4 className="mt-5 text-xs font-semibold uppercase tracking-wider text-navy/50">
          Assistance programs for {primary}
        </h4>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {PROGRAM_SECTIONS.map((section) => (
            <ProgramSection
              key={section.key}
              section={section}
              programs={med[section.key] || []}
            />
          ))}
        </div>
      </div>
    </article>
  );
}

function ConditionDetail({ condition, onBack }) {
  const meds = condition.medications || [];
  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 text-sm font-medium text-navy/70 hover:text-navy"
      >
        <ChevronLeft className="h-4 w-4" aria-hidden="true" /> All liver conditions
      </button>

      <header className="mt-4">
        <p className="text-sm font-medium uppercase tracking-wide text-coral">
          {condition.category || 'Hepatology'}
        </p>
        <h1 className="mt-1 text-3xl font-bold text-navy">{condition.name}</h1>
        {condition.description && (
          <p className="mt-2 max-w-3xl text-navy/72">{condition.description}</p>
        )}
        <p className="mt-3 text-sm text-navy/60">
          <Pill className="-mt-0.5 mr-1 inline h-4 w-4" aria-hidden="true" />
          {meds.length} {meds.length === 1 ? 'medication' : 'medications'} on file
        </p>
      </header>

      {meds.length === 0 ? (
        <p className="mt-8 rounded-lg border border-navy/10 bg-white p-6 text-navy/60">
          No medications are currently linked to this condition.
        </p>
      ) : (
        <div className="mt-8 space-y-6">
          {meds.map((m) => (
            <MedicationBlock key={m.id} med={m} />
          ))}
        </div>
      )}
    </div>
  );
}

function ConditionList({ conditions, onPick }) {
  return (
    <div>
      <header>
        <p className="text-sm font-medium uppercase tracking-wide text-coral">Hepatology</p>
        <h1 className="mt-1 text-3xl font-bold text-navy">Browse by liver condition</h1>
        <p className="mt-2 max-w-2xl text-navy/72">
          Pick a condition to see the medications used to treat it. Each medication lists copay
          cards and patient assistance programs in separate sections so you can find the right
          kind of help.
        </p>
      </header>

      {/* How-it-works strip: three numbered steps so a conference visitor
          can grasp the flow without watching a walkthrough. */}
      <ol className="mt-6 grid gap-3 sm:grid-cols-3" aria-label="How this works">
        {[
          {
            n: 1,
            title: 'Pick a condition',
            body: 'Choose what you (or your patient) are managing.',
          },
          {
            n: 2,
            title: 'See the medications',
            body: 'Only the drugs actually used to treat that condition.',
          },
          {
            n: 3,
            title: 'Find the right help',
            body: 'Copay cards if insured, PAPs if uninsured -- never mixed.',
          },
        ].map((step) => (
          <li
            key={step.n}
            className="rounded-xl border border-navy/10 bg-white p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <span
                aria-hidden="true"
                className="inline-flex h-7 w-7 flex-none items-center justify-center rounded-full bg-coral text-sm font-bold text-white"
              >
                {step.n}
              </span>
              <div className="min-w-0">
                <p className="font-semibold text-navy">{step.title}</p>
                <p className="mt-0.5 text-sm text-navy/65">{step.body}</p>
              </div>
            </div>
          </li>
        ))}
      </ol>

      {conditions.length === 0 ? (
        <div className="mt-8 flex items-start gap-3 rounded-lg border border-navy/15 bg-white p-5">
          <AlertCircle className="h-5 w-5 flex-none text-coral" aria-hidden="true" />
          <div className="text-sm text-navy/72">
            <p className="font-medium text-navy">No conditions loaded yet.</p>
            <p className="mt-1">
              Run <code className="rounded bg-navy/10 px-1.5 py-0.5 text-navy">node export_from_neon.js --liver-only</code>{' '}
              to populate <code className="rounded bg-navy/10 px-1.5 py-0.5 text-navy">src/data/liver_conditions.json</code> from Neon.
            </p>
          </div>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {conditions.map((c) => (
            <li key={c.id}>
              <button
                type="button"
                onClick={() => onPick(c.id)}
                className="group h-full w-full rounded-2xl border border-navy/10 bg-white p-5 text-left shadow-sm transition hover:border-coral/60 hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-coral"
              >
                <h2 className="text-lg font-semibold text-navy group-hover:text-coral">
                  {c.name}
                </h2>
                {c.description && (
                  <p className="mt-2 line-clamp-3 text-sm text-navy/72">{c.description}</p>
                )}
                <p className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-navy/60">
                  <Pill className="h-4 w-4" aria-hidden="true" />
                  {c.medication_count ?? (c.medications?.length || 0)}{' '}
                  {(c.medication_count ?? c.medications?.length) === 1 ? 'medication' : 'medications'}
                </p>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LiverConditions() {
  useMetaTags(seoMetadata.liverConditions);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedId = searchParams.get('condition');

  const conditions = liverData.conditions || [];
  const selected = useMemo(
    () => (selectedId ? conditions.find((c) => String(c.id) === String(selectedId)) : null),
    [conditions, selectedId]
  );

  const handlePick = (id) => {
    setSearchParams({ condition: String(id) });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  const handleBack = () => {
    setSearchParams({});
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <nav className="mb-6 text-sm text-navy/60">
        <Link to="/" className="hover:text-navy">Home</Link>
        <span className="mx-2">/</span>
        <span className="text-navy">Liver Conditions</span>
      </nav>

      {selected ? (
        <ConditionDetail condition={selected} onBack={handleBack} />
      ) : (
        <ConditionList conditions={conditions} onPick={handlePick} />
      )}
    </div>
  );
}
