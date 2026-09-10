# GANJI — Deploy a itch.io

## 1. Generar el paquete

```powershell
npm run build
Compress-Archive -Path dist\* -DestinationPath ganji-web.zip -Force
```

El zip contiene el juego 100% estático (HTML + JS, ~1.5 MB, ~400 KB gzip):
se sube tal cual, sin backend ni servidor.

## 2. Publicar

1. Crea un proyecto nuevo en itch.io → tipo **HTML**.
2. Sube `ganji-web.zip`.
3. Settings del proyecto:
   - **Embed options**: marcar **"This file will be played in the browser"**.
   - Frame size: **960 × 540** (el canvas usa `Scale.FIT`, se adapta solo).
   - Iframe: ✅ *Fullscreen button*.
4. Visibilidad: **Restricted → Public** cuando quieras lanzarlo.

## 3. Actualizar (butler, recomendado)

```powershell
butler push dist <tu-usuario>/ganji:html-push --userversion 1.0.0
```

## Checklist previo a lanzar

- [x] `npm run release:check` en verde (build + E2E headless sobre producción)
- [x] Guardado en localStorage versionado (`ganji.save`)
- [x] Sin assets con licencia externa: todo el arte y audio es procedructural/propio
- [ ] Cambiar versión en `docs/specs` si hay cambios de diseño
