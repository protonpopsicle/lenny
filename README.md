# lenny
Lenny is a Discord bot

## Run with Docker
```
$ docker buildx build . -t user/lenny
$ docker run --rm --env-file .env --name lenny -p 3000:3000 user/lenny
```

## Kubernetes
```
$ eval $(minikube -p minikube docker-env)
$ docker buildx build . -t user/lenny
$ kubectl create configmap lenny-config --from-env-file=.env
$ kubectl apply -f lenny-deployment.yaml
% kubectl logs -l app=lenny
```