pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "floating-agent:latest"
        DOCKER_REGISTRY = "your-registry.example.com" // Change to your Docker registry if needed
        REMOTE_HOST = "user@your-ubuntu-server"      // Change to your Ubuntu server SSH
        REMOTE_PATH = "/opt/floating-agent"          // Change to your deploy path
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $DOCKER_IMAGE .'
            }
        }
        stage('Push Docker Image') {
            when {
                expression { env.DOCKER_REGISTRY != '' }
            }
            steps {
                sh 'docker tag $DOCKER_IMAGE $DOCKER_REGISTRY/$DOCKER_IMAGE'
                sh 'docker push $DOCKER_REGISTRY/$DOCKER_IMAGE'
            }
        }
        stage('Deploy to Ubuntu Server') {
            steps {
                // Copy docker-compose.yml and agent-config.json to server
                sh 'scp docker-compose.yml agent-config.json $REMOTE_HOST:$REMOTE_PATH/'
                // Copy Dockerfile and scripts if needed
                sh 'scp Dockerfile floating-agent.js floating-agent.min.js $REMOTE_HOST:$REMOTE_PATH/'
                // Deploy via SSH
                sh '''ssh $REMOTE_HOST "cd $REMOTE_PATH && docker compose pull || true && docker compose up -d --build"'''
            }
        }
    }
    post {
        success {
            echo 'Deployment successful!'
        }
        failure {
            echo 'Deployment failed.'
        }
    }
}
