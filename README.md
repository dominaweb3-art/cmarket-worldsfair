# C Market

C Market es una aplicación móvil para Solana Seeker que conecta una wallet mediante Mobile Wallet Adapter y permite probar el flujo de compra de la cesta C3 en Solana Devnet.

> Estado actual: prototipo funcional de Devnet. La transferencia USDC a la tesorería está implementada y verificable en Explorer. La distribución real de SOL, USDC y JitoSOL todavía no está implementada.

## Requisitos

- Node.js LTS
- Java/JDK 17
- Android Studio con Android SDK y un dispositivo Android o Solana Seeker
- Phantom, Solflare u otra wallet compatible con MWA

## Instalación y desarrollo

```bash
npm install
npm run doctor
npm run ci
npm run android
```

`npm run android` instala un development build. Para la entrega del hackatón hay que generar, firmar e instalar un APK de release desde cero; no debe depender de Metro ni `localhost`.

## Flujo Devnet probado

1. Abrir C Market en Android/Seeker.
2. Conectar la wallet con MWA.
3. Seleccionar C3 y un monto de prueba de al menos 5 USDC.
4. Revisar saldo y destino antes de aprobar en la wallet.
5. Confirmar la firma y abrir la transacción en Solana Explorer.

Configuración de prueba:

- Red: Solana Devnet.
- Mint USDC Devnet: `4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU`.
- Tesorería de prueba: `FnkzNN99YHhoR6Lu5kfnYj5X4ULLqoKTyi5P5xpBJhAZ`.
- Mínimo temporal: 5 USDC. Revisar antes de producción.

No se almacenan semillas ni claves privadas. Las direcciones anteriores son públicas y solo corresponden al entorno de prueba.

## Validación

```bash
npm run doctor
npx tsc --noEmit
npm run lint:check
npm run format:check
git diff --check
```

## Seguridad y límites conocidos

- La app solicita firma a la wallet; nunca toca claves secretas.
- Se valida red, mint, saldo, monto y destino antes de solicitar la firma.
- Se contemplan cancelación, errores, confirmación, firma y enlace a Explorer.
- El pago actual envía USDC a la tesorería de Devnet; no debe describirse como una cesta con activos distribuidos hasta implementar y probar el vault/programa C3.
- No usar frases como “ganancia garantizada”, “rendimiento seguro” o “retorno asegurado”.

## Entrega CLOCK IN

Antes de enviar:

- Generar un APK de release firmado e instalarlo desde cero en un Seeker.
- Verificar que no dependa de Metro, `localhost`, URLs internas ni del servidor de desarrollo.
- Probar conexión MWA, cancelación, saldo insuficiente, red equivocada, error RPC, doble clic y reintento.
- Preparar repositorio público, video demo, pitch deck, capturas, licencia y metadatos de publicación.
- Presentar explícitamente qué está implementado en Devnet y qué queda en el roadmap.
- Revisar nuevamente los términos oficiales antes de enviar.

La lista ampliada de reglas, fuentes y entregables está en el documento `C-Market-CLOCK-IN-reglas-y-urls.md` del workspace.

## Documentación oficial

- [Solana Mobile](https://docs.solanamobile.com/get-started/overview)
- [Mobile Wallet Adapter](https://docs.solanamobile.com/solana-mobile-stack/mobile-wallet-adapter)
- [Solana dApp Store](https://docs.solanamobile.com/dapp-store/intro)
- [Portal de publicación](https://publish.solanamobile.com/)
