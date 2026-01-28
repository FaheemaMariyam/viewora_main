"# viewora_ai" 
"# viewora_ai" 
1- Kubernetes (k3s)
 ---------------
a) What is Kubernetes (K8s)?
- Think of your code (Docker container) as a Waiter.
-Docker: Defines the waiter's uniform and job description.
-Kubernetes: Is the Restaurant Manager.
If a waiter drops a tray (app crashes), the Manager sends a new waiter immediately (Self-Healing).
If 100 customers arrive at once, the Manager calls 5 more waiters to help (Auto-Scaling).

b) What is k3s?
-Kubernetes is like a generic "Manager" designed for huge stadiums (Google/Amazon). It is heavy and complex.
-k3s is a lightweight version of that Manager, designed for smaller restaurants or single computers. It does 100% of the same job but uses much less memory.
-k3d (which we used) is a tool that runs k3s inside Docker, so you don't need a separate server to experiment.

* Where & Why Viewora Used It?
-The Component: AI Service
We only applied k3s to the AI Service (Viewora_ai_service).

-The Reason
The AI Service is the "heaviest" part of Viewora. It processes complex database queries and calculates embeddings.

-Before k3s: If 50 users searched for properties at once, the single AI container would slow down or crash.
-After k3s: The system monitors the "stress" (CPU usage). If it gets too high, it automatically starts more AI copies to share the load.

* Implementation Log
  
-Phaes 1: Installation
We installed the "Manager" (k3d) and the "Remote Control" (kubectl) using Windows native tools.

--Command: winget install k3d
--Command: winget install Kubernetes.kubectl
Location: Installed system-wide on Windows (accessible from any terminal).

-Phase 2: Building the Infrastructure (Cluster)
We created a virtual cluster named viewora-cluster.

--Command:
k3d cluster create viewora-cluster --api-port 127.0.0.1:6443 --servers 1 --agents 2 -p "8081:80@loadbalancer"
Configuration:
--agents 2: Started with 2 "worker" nodes (servers) ready to run code.
--api-port 127.0.0.1:6443: Fixed the Windows connection bug by forcing a specific local address.

-Phase 3: Preparing the Code (Images)

Since the cluster runs inside its own bubble, we had to "push" our AI code into it.
--Built the Image:
docker build -t viewora-ai:latest ./Viewora_ai_service
--Imported to Cluster:
--k3d image import viewora-ai:latest -c viewora-cluster

-Phase 4: The Instructions (Manifests)

We wrote three files in the /k8s folder to tell the Manager what to do:
-ai-deployment.yaml: "Run the viewora-ai image. Start with 2 copies. Request 100m CPU."
-ai-service.yaml: "Give these copies a phone number so they can be reached."
-ai-hpa.yaml: "If CPU usage > 70%, create more copies (up to 5)."

Phase 5: Deployment & Verification

-Deploy: We sent the instructions to the cluster.
kubectl apply -f k8s/
-Stress Test: We launched a "Load Generator" to attack the /health endpoint with traffic.
kubectl run -i --tty load-generator ... (hitting http://ai-service/health)
-Result: We watched the CPU hit 200%+ and saw the REPLICAS count automatically jump from 2 → 5.

4. Summary

we now have a production-grade Auto-Scaling Infrastructure running on your local machine.
-Status: Active & Verified.
-Impact: Your AI Service can now survive massive traffic spikes without crashing.
-Maintenance: Stopped via k3d cluster stop viewora-cluster.
