#!/bin/bash
echo "Building..."
npm run build
echo "Deploying to GitHub Pages..."
npx gh-pages -d dist
echo "Done!"
