# GANJI — Documento de Diseño

**Fecha:** 2026-09-04 · **Estado:** Aprobado por el usuario en chat

## 1. Concepto

Survivor-like roguelite 2D ambientado en el Japón feudal mitológico. Un ronin sin señor sobrevive la noche contra oleadas de yokai. Estética ukiyo-e: paleta índigo/bermellón/dorado sobre tinta negra, pétalos de sakura como ambiente.

## 2. Plataforma y motor

- **Ejecución:** navegador (web), se juega al instante.
- **Motor:** Phaser 4.2 + TypeScript (strict) + Vite.
- **Tests:** vitest sobre la lógica de `systems/` (pura, sin Phaser).
- **Resolución base:** 960×540, `pixelArt: true`, `Scale.FIT` con safe area.

## 3. Core loop

1. Movimiento (WASD/flechas/táctil); las armas atacan automáticamente.
2. Los yokai sueltan XP (espíritus) y oro (monedas).
3. Subir de nivel → elegir 1 de 3-4 mejoras (arma nueva, evolución, pasiva).
4. Cada X minutos un mini-jefe; a los 15 min el jefe final → victoria o muerte.
5. El oro alimenta la meta-progresión permanente entre runs.

## 4. Contenido (juego completo, por fases)

| Categoría | Detalle |
|---|---|
| Personajes (5) | Ronin (katana, equilibrado), Kunoichi (kunais, rápida), Sohei (bō, tanque), Onmyoji (talismanes), Kensei (secreto) |
| Armas (8 + evoluciones) | Katana → Viento Cortante, Kunai, Talismanes, Arco, Máscara Oni, Fuego Kasha, Rayo Raijū, Abanico |
| Pasivas (8) | Daño, cooldown, área, velocidad, vida máx., imán, armadura, suerte |
| Enemigos (~15) | Oni, Kappa, Tengu, Kodama, brutes, spitters, élites, mini-jefes |
| Jefes (3) | Gashadokuro (bosque), Karakasa (templo), Orochi (final) |
| Mapas (3) | Bosque de bambú (noche), Templo de sakura (atardecer), Montaña congelada (hard) |

## 5. Meta-progresión

- Oro persistente → tienda de poderes permanentes (~15 entradas).
- Desbloqueos por logros (personajes, mapas, armas ocultas).
- Guardado local versionado (`ganji.save.v1`) en localStorage con migración.
- Resumen de run: tiempo, kills, DPS, oro ganado.

## 6. Arquitectura

```
src/
├─ main.ts              # Phaser.Game config
├─ scenes/              # Boot → Preload → Menu → CharSelect → Game (+UIScene)
├─ systems/             # Lógica pura testeable: spawn-director, upgrade-system,
│                       #   damage-system, save-system, event-bus
├─ data/                # Data-driven: weapons, enemies, waves, characters, maps, shop
├─ entities/            # Player, Enemy (FSM + pool), Projectile, Pickup
└─ ui/                  # HUD, LevelUpModal, tienda, menús
```

Decisiones clave:

- **Data-driven:** añadir contenido = añadir objetos tipados en `data/`, sin tocar código.
- **Object pooling** de enemigos, proyectiles, pickups y números de daño (300+ enemigos sin GC spikes).
- **UIScene** en paralelo (`scene.launch`); level-up pausa el mundo.
- **Cámara:** follow con lerp + screen shake.
- **Arte:** Fase 1 usa texturas procedurales placeholder (greybox); el arte final (pixel art ukiyo-e, packs curados + generación propia) se integra después sin tocar la lógica.
- **Audio:** música ambiental por mapa + SFX libres, volúmenes configurables (Fase 2).

## 7. Fases de implementación (cada fase = jugable)

1. **Core loop** — 1 personaje, 3 armas, 6 enemigos, 1 mini-jefe, 1 mapa, XP/level-up, HUD, muerte.
2. **Game feel** — shake, hit-stop, partículas, knockback, SFX, música.
3. **Meta** — menú, selección de personaje/mapa, tienda de oro, guardado, 3 personajes.
4. **Contenido completo** — todas las armas/enemigos/jefes/mapas/personajes + logros.
5. **Lanzamiento** — performance audit, pulido UI/UX, página itch.io.

## 8. Verificación

- `vitest` sobre `systems/` (spawn, daño, upgrades, save).
- `tsc --strict` + ESLint sin errores.
- Prueba manual en navegador al cierre de cada fase.
