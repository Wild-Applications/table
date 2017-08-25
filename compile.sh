docker build -t wildapps/table:0.0.1 . &&
kubectl scale --replicas=0 deployment deployment --namespace=table &&
kubectl scale --replicas=2 deployment deployment --namespace=table
