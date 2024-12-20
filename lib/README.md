Le fichier ```imicros-feel-interpreter.config.js``` est le fichier WebPack pour générer le fichier
```IMICROS_FEEL_Interpreter.js```.
Il faut mettre en commentaire ```const util = require('util');``` au préalable dans le fichier ```./lib/interpreter.js```.

## FEELin packaging

```webpack configtest feelin.config.cjs```

```webpack --config feelin.config.cjs```
