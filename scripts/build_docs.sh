#!/bin/sh
set -e

yarn build:ci
yarn lerna run bundle --scope @essex/embeddings-explorer

# Bundle the Embeddings Explorer Application and copy it into the docsite as a static asset
cp -r packages/apps/embeddings-explorer/build/ packages/apps/docsite/static/embeddings-explorer/
mkdir packages/apps/docsite/static/apidocs/

# Copy in generated api docs
cp -r packages/authoring/vac/dist/docs/  packages/apps/docsite/static/apidocs/vac/
cp -r packages/authoring/vac-kruda/dist/docs/  packages/apps/docsite/static/apidocs/vac-kruda/
cp -r packages/authoring/vac-react/dist/docs/  packages/apps/docsite/static/apidocs/vac-react/
cp -r packages/components/datatable-vac/dist/docs/  packages/apps/docsite/static/apidocs/datatable-vac/
cp -r packages/components/filterchip-vac/dist/docs/  packages/apps/docsite/static/apidocs/filterchip-vac/
cp -r packages/components/graph-vac/dist/docs/  packages/apps/docsite/static/apidocs/graph-vac/
cp -r packages/components/ranklist-vac/dist/docs/  packages/apps/docsite/static/apidocs/ranklist-vac/
cp -r packages/components/search-vac/dist/docs/  packages/apps/docsite/static/apidocs/search-vac/
cp -r packages/components/title-vac/dist/docs/  packages/apps/docsite/static/apidocs/title-vac/

# Bundle the Docsite
yarn lerna run bundle --scope @essex/visual-analytics-components-docsite