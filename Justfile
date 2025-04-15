[working-directory: 'ansible']
deploy:
    ansible-playbook deploy-playbook.yml -i inventory

dev:
    npm run dev


docker-build:
    docker build -t scotch3840/kanagu .

docker:
    docker build -t scotch3840/kanagu .
    docker push scotch3840/kanagu

