pipeline {
    agent { label 'Theresa Japan Server' }

    stages {
        stage('Build') {
            steps {
                sh 'electron-builder -wl tar.gz'
                archiveArtifacts artifacts: 'build/*.tar.gz', fingerprint: true
                archiveArtifacts artifacts: 'build/.exe', fingerprint: true
            }
        }
    }
}
