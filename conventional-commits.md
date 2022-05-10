fix: bugfixes
build: build fixes
chore: changes that don't affect the codebase
ci: changes that affect CI
docs: changes that affect docs
feat: new features
perf: changes that affect performance
refactor: changes that don't affect the codebase
revert: revert to previous commit
style: changes that don't affect the codebase
test: changes that affect tests


config for eslint + standard

npm i -D eslint-plugin-standard@4.0.1 \
eslint-plugin-promise@4.2.1 \
eslint-plugin-import@2.20.0 \
eslint@6.8.0 \
@typescript-eslint/eslint-plugin@2.16.0 \
eslint-config-standard-with-typescript@11.0.1 \
eslint-plugin-node@9.2.0

## Check for updates
npm i -g npm-check
npm-check -s -u

## Add new husky hook

// example
npx husky add .husky/pre-commit "lint-staged"    


## Amend commit 
git commit --amend --no-edit