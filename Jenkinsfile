pipeline {
    agent any
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Clean previous chatwidget containers') {
            steps {
                dir('chatwidget') {
                    sh 'docker compose down || true'
                }
            }
        }
        stage('Build and Deploy chatwidget via Docker Compose') {
            steps {
                dir('chatwidget') {
                    sh 'docker compose up -d --build'
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
