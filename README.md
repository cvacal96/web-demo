# 🌐 Demo CI/CD en OpenShift 4 - iotware-demo

Este proyecto muestra cómo OpenShift 4 puede **construir, versionar y desplegar automáticamente** una aplicación web sencilla directamente desde código fuente mediante los objetos nativos:

- **BuildConfig**
- **ImageStream**
- **DeploymentConfig**
- **Service + Route**

Todo el flujo ocurre dentro del clúster, sin necesidad de Jenkins, Tekton o ArgoCD.

---

## 🧱 Arquitectura del flujo

```
GitHub repo ──► BuildConfig ──► ImageStream ──► DeploymentConfig ──► Pod ──► Route
```

1. OpenShift detecta un cambio en el repositorio Git (push o trigger manual).
2. El **BuildConfig** construye la imagen Docker dentro del clúster.
3. El resultado se almacena en un **ImageStream** (`web-demo:latest`).
4. El **DeploymentConfig** detecta el nuevo tag y actualiza automáticamente el despliegue.
5. El **Service** y la **Route** exponen la aplicación al público.

---

## 🧩 Estructura del repositorio

```
web-demo/
├── Dockerfile
├── index.html
├── styles.css
├── app.js
└── openshift/
    ├── imagestream.yaml
    ├── buildconfig.yaml
    ├── deploymentconfig.yaml
    └── service-route.yaml
```

---

## 🚀 Despliegue paso a paso

### 1️⃣ Seleccionar el proyecto

Asegúrate de estar en el namespace correcto:

```bash
oc project iotware-demo
```

---

### 2️⃣ Aplicar los manifiestos

Aplica los objetos de OpenShift:

```bash
oc apply -f openshift/imagestream.yaml
oc apply -f openshift/buildconfig.yaml
oc apply -f openshift/deploymentconfig.yaml
oc apply -f openshift/service-route.yaml
```

Verifica:

```bash
oc get is,bc,dc,svc,route
```

---

### 3️⃣ Primer build manual

Si tu entorno no permite triggers de GitHub (por ejemplo en TechZone Power10):

```bash
oc start-build web-demo-build --from-dir=. --follow
```

Esto construirá la imagen localmente y la enviará al **ImageStream**.

---

### 4️⃣ Desplegar y acceder a la app

Después del build exitoso, OpenShift creará un nuevo `Pod` y desplegará la aplicación.

Obtén la URL pública:

```bash
oc get route web-demo -o jsonpath='{.spec.host}'
```

Abre esa URL en tu navegador 🎉

---

## 🔁 Activar trigger de GitHub (opcional)

Si tu entorno tiene salida a internet y deseas habilitar el webhook:

1. Obtén el URL del webhook:
   ```bash
   oc describe bc web-demo-build | grep "Webhook GitHub"
   ```
   Ejemplo:
   ```
   https://api.cluster.openshift.com/apis/build.openshift.io/v1/namespaces/iotware-demo/buildconfigs/web-demo-build/webhooks/demo-secret/github
   ```

2. En tu repositorio GitHub:
   - Ve a **Settings → Webhooks → Add webhook**
   - **Payload URL:** pega el enlace anterior  
   - **Content type:** `application/json`  
   - **Secret:** `demo-secret`  
   - **Event:** "Just the push event"

3. Guarda el webhook y prueba haciendo un cambio en el código:
   ```bash
   git commit -am "Cambio de color del formulario"
   git push
   ```

4. Observa el build automático:
   ```bash
   oc get builds -w
   ```

---

## 🎨 Personaliza la demo

El archivo [`styles.css`](./styles.css) define los colores principales.  
Durante la demo puedes cambiar un color y hacer `git push` para mostrar cómo OpenShift reconstruye y despliega automáticamente.

Ejemplo:
```css
h1 {
  color: #0078d7; /* Nuevo color del título */
}
```

---

## ⚙️ Archivos principales

### 🔹 Dockerfile
Usa una imagen base universal compatible con POWER10:
```dockerfile
FROM registry.access.redhat.com/ubi9/httpd-24:latest
COPY . /var/www/html/
RUN chmod -R g+rwX /var/www/html
EXPOSE 8080
```

### 🔹 BuildConfig
Construye la imagen desde GitHub y la publica en el ImageStream `web-demo:latest`.

### 🔹 DeploymentConfig
Despliega la app y se actualiza automáticamente con cada nueva imagen.

### 🔹 Service & Route
Exponen la aplicación internamente y públicamente.

---

## 🔍 Validaciones opcionales

### ✅ Verificar acceso a GitHub desde el clúster
```bash
oc run test-github   --image=registry.access.redhat.com/ubi9/ubi-minimal   --restart=Never   -- curl -I https://github.com
```
Si ves `HTTP/2 200`, hay conectividad correcta.

### ✅ Limpiar pod de prueba
```bash
oc delete pod test-github
```

---

## 🧠 Notas para el entorno TechZone POWER10

- Usa imágenes base **UBI9** o **-ppc64le**, compatibles con Power.
- Los triggers GitHub pueden no funcionar si no hay conexión externa.
- Puedes demostrar el flujo completo usando `oc start-build` manual.

---

## 🧹 Limpieza

Cuando finalices la demo:

```bash
oc delete all -l app=web-demo
```

O elimina el proyecto completo:

```bash
oc delete project iotware-demo
```

---

## 📦 Resultado esperado

- Una página web sencilla con formulario accesible por Route.
- Cada cambio en el código fuente genera un nuevo Build y despliegue.
- OpenShift gestiona todo el ciclo CI/CD dentro del clúster.

---

## 💡 Autor

Demo creada por **Carlos Vaca Loaiza**  
💼 Proyecto: `iotware-demo`  
🏗️ Plataforma: OpenShift 4 (IBM TechZone, POWER10)
