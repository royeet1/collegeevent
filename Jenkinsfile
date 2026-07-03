pipeline {
    agent any

    stages {

        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Build Spring Boot') {
            steps {
                bat '.\\mvnw.cmd clean package'
            }
        }

        stage('Check Environment') {
            steps {
                bat 'echo ================= PATH ================='
                bat 'echo %PATH%'
                bat 'echo ========================================'
                bat 'where docker'
                bat 'docker --version'
            }
        }

        stage('Build Docker Image') {
            steps {
                bat 'docker build -t collegeevent:v1 .'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s\\deployment.yaml'
                bat 'kubectl apply -f k8s\\service.yaml'
                bat 'kubectl rollout restart deployment/collegeevent-deployment'
            }
        }
    }

    post {
        success {
            echo 'College Event Website deployed successfully!'
        }

        failure {
            echo 'Build failed. Please check the console output.'
        }
    }
}