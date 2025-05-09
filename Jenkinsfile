pipeline {
    agent any
    environment {
        DEPLOY_PATH = "/opt/floating-agent" // Путь для деплоя
    }
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        stage('Build chatwidget Docker Image') {
            steps {
                dir('chatwidget') {
                    sh 'docker build -t chatwidget:latest .'
                }
            }
        }
        stage('Copy files to deploy path') {
            steps {
                sh 'mkdir -p $DEPLOY_PATH'
                sh 'cp docker-compose.yml agent-config.json $DEPLOY_PATH/'
                sh 'cp -r chatwidget $DEPLOY_PATH/'
            }
        }
        stage('Deploy chatwidget locally') {
            steps {
                sh '''cd $DEPLOY_PATH/chatwidget && docker stop chatwidget || true && docker rm chatwidget || true && docker build -t chatwidget:latest . && docker run -d --name chatwidget -p 3000:3000 chatwidget:latest'''
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
