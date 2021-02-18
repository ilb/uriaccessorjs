pipeline {
    agent any
    options {
        disableConcurrentBuilds()
        buildDiscarder(logRotator(numToKeepStr: '3'))
    }
    stages {
        stage ('Build') {
            steps {
                sh 'npm install && npm run test && npm publish'
            }
        }
    }
    post {
        always {
            deleteDir()
        }
    }
}
