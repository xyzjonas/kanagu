[working-directory: 'ansible']
deploy:
    ansible-playbook deploy-playbook.yml -i inventory

dev:
    npm run dev
