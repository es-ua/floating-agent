pipeline {
    agent any
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
        stage('Deploy chatwidget locally') {
            steps {
                sh '''cd chatwidget && docker stop chatwidget || true && docker rm chatwidget || true && docker build -t chatwidget:latest . && docker run -d --name chatwidget -p 3000:3000 chatwidget:latest'''
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
