pipeline {
    agent any
    environment {
        DOCKER_BUILDKIT = 1 // Enable BuildKit for advanced build options
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Clean previous chatwidget containers') {
            steps {
                dir('chatwidget') {
                    sh 'docker compose -f docker-compose.yml down || true'
                }
            }
        }
        stage('Build and Deploy chatwidget via Docker Compose') {
            steps {
                dir('chatwidget') {
                    // Add --no-cache to force rebuild without cache
                    sh 'docker compose -f docker-compose.yml build --no-cache'
                    sh 'docker compose -f docker-compose.yml up -d'
                }
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
