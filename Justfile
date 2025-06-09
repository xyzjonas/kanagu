[working-directory: 'ansible']
deploy:
    VITE_SENTRY_ENV=production ansible-playbook deploy-playbook.yml -i inventory

dev:
    npm run dev

preview:
    npm run build-only
    npm run preview

openapi-gen:
    npm run openapi-ts

docker-build:
    VITE_SENTRY_ENV=production docker build -t scotch3840/kanagu .

docker:
    VITE_SENTRY_ENV=production docker build -t scotch3840/kanagu .
    docker push scotch3840/kanagu

