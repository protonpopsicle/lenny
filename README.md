# lenny
Lenny is a Discord bot

## Run with Docker
```
$ docker buildx build . -t user/lenny
$ docker run --rm --env-file .env --name lenny -p 3000:3000 user/lenny
```

## Run with Kubernetes
```
# for local
$ eval $(minikube -p minikube docker-env)
$ docker buildx build . -t user/lenny

# for GKE
$ gcloud builds submit \
  --tag us-west1-docker.pkg.dev/lenny-448217/lenny-repo/lenny-gke .

# same same
$ kubectl create configmap lenny-config --from-env-file=.env
$ kubectl apply -f lenny-deployment.yaml
% kubectl logs -l app=lenny
```