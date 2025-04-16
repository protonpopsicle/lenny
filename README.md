# lenny
Lenny is a Discord bot

## Create .env
```
$ cp .env.example .env
```

Populate the values in the .env file so code has access to necessary environment variables at run time.

## How to run with Docker
```
$ docker buildx build . -t user/lenny
$ docker run --rm --env-file .env --name lenny -p 3000:3000 user/lenny
```

## How to run with Kubernetes (local example with Minikube)
```
$ eval $(minikube -p minikube docker-env)
$ docker buildx build . -t user/lenny
$ kubectl create configmap lenny-config --from-env-file=.env
$ kubectl apply -f lenny-deployment.yaml
% kubectl logs -l app=lenny
```

For GKE, same steps as above but Docker steps slightly different. Example:
```
$ docker buildx build --platform linux/amd64 . -t us-west1-docker.pkg.dev/lenny-448217/lenny-repo/lenny-gke:latest
$ docker push us-west1-docker.pkg.dev/lenny-448217/lenny-repo/lenny-gke:latest
```
