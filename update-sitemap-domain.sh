#!/bin/bash

# Script to update sitemap and robots.txt with your actual deployed domain
# Usage: ./update-sitemap-domain.sh your-actual-domain.com

if [ -z "$1" ]; then
    echo "❌ Error: No domain provided"
    echo ""
    echo "Usage: ./update-sitemap-domain.sh your-actual-domain.com"
    echo ""
    echo "Examples:"
    echo "  ./update-sitemap-domain.sh my-site.netlify.app"
    echo "  ./update-sitemap-domain.sh my-site.vercel.app"
    echo "  ./update-sitemap-domain.sh amednav.com"
    exit 1
fi

NEW_DOMAIN="$1"
OLD_DOMAIN="amednav.com"

echo "🔄 Updating domain from '$OLD_DOMAIN' to '$NEW_DOMAIN'..."
echo ""

# Update sitemap.xml
if [ -f "public/sitemap.xml" ]; then
    sed -i "s|https://${OLD_DOMAIN}/|https://${NEW_DOMAIN}/|g" public/sitemap.xml
    echo "✅ Updated public/sitemap.xml"
else
    echo "⚠️  public/sitemap.xml not found"
fi

# Update robots.txt
if [ -f "public/robots.txt" ]; then
    sed -i "s|https://${OLD_DOMAIN}/|https://${NEW_DOMAIN}/|g" public/robots.txt
    echo "✅ Updated public/robots.txt"
else
    echo "⚠️  public/robots.txt not found"
fi

# Update index.html meta tags
if [ -f "index.html" ]; then
    sed -i "s|https://${OLD_DOMAIN}/|https://${NEW_DOMAIN}/|g" index.html
    echo "✅ Updated index.html"
else
    echo "⚠️  index.html not found"
fi

echo ""
echo "✨ Domain update complete!"
echo ""
echo "Next steps:"
echo "  1. Review the changes in the files above"
echo "  2. Build your site: npm run build"
echo "  3. Deploy: netlify deploy --prod (or vercel --prod)"
echo "  4. Test: https://${NEW_DOMAIN}/sitemap.xml"
echo "  5. Resubmit sitemap in Google Search Console"
echo ""
