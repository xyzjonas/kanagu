[working-directory: 'ansible']
deploy:
    ansible-playbook deploy-playbook.yml -i inventory

dev:
    npm run dev

preview:
    npm run build-only
    npm run preview

openapi-gen:
    npm run openapi-ts

docker-build:
    docker build -t scotch3840/kanagu .

docker:
    docker build -t scotch3840/kanagu .
    docker push scotch3840/kanagu

