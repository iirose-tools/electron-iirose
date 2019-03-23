pipeline {
    agent { label 'master' }

    stages {
        stage('Build') {
            steps {
                sh 'electron-builder -wl tar.gz'
                archiveArtifacts artifacts: './build/*.tar.gz', fingerprint: true
            }
        }
    }
}
