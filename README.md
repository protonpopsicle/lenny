# lenny
Lenny is a Discord bot

## Create .env
```
% cp .env.example .env
```

Populate the values in the .env file so code has access to necessary environment variables at run time.

## Run with Docker
```
% docker buildx build . -t user/lenny
% docker run --rm --env-file .env --name lenny -p 3000:3000 user/lenny
```

## Google Compute Engine VM
```
% docker buildx build --platform linux/amd64 . -t us-west1-docker.pkg.dev/lenny-448217/lenny-repo/lenny-gke:latest
% docker push us-west1-docker.pkg.dev/lenny-448217/lenny-repo/lenny-gke:latest
% gcloud compute instances create-with-container lenny-instance \
--container-image us-west1-docker.pkg.dev/lenny-448217/lenny-repo/lenny-gke:latest \
--zone us-west1-a \
--container-env-file .env \
--machine-type e2-micro
```

## Update rather than create VM
```
% gcloud compute instances update-container lenny-instance \
--container-image us-west1-docker.pkg.dev/lenny-448217/lenny-repo/lenny-gke:latest \
--zone us-west1-a
```

Reference: https://cloud.google.com/compute/docs/containers/configuring-options-to-run-containers

