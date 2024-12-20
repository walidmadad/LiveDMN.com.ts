declare const tf: any;

export default class Tensor_trials {
    static Trials = () => {
        // https://js.tensorflow.org/api/4.2.0/#Tensors-Random
        // https://js.tensorflow.org/api/4.2.0/#randomNormal (attention, 'tf' réalise des arrondis si 'int32')
        let t2D = tf.randomNormal([2, 2], 0, 1, 'float32', /*seed?*/Date.now());
        // let t2D = tf.randomStandardNormal([2, 2], 'float32', /*seed?*/Date.now());
        t2D.print();
        console.log(t2D.arraySync());

        const encoder = new TextEncoder();
        /**
         * 'shape' : taille de l'échantillon ('batch' ou 'sample') puis taille de la 'feature'...
         * Ci-dessous, 4 valeurs fournies ('shape' est déduit à partir de 'values')
         */
        // const t3D = tf.tensor([[[9], encoder.encode("Java")], [[11], encoder.encode("Java")],
        //     [[4], encoder.encode("TypeScript")], [[5], encoder.encode("Java")]]/*, [4, 2, 1]*/);
        // console.info("shape: " + t3D.shape + // '[4, 2, 1]'
        //     " - rank: " + t3D.rank + // '3'
        //     " - dtype: " + t3D.dtype // 'float32' (default)
        // );
        // t3D.print();

        // Chaque caractère dans les 2 chaînes (données séquentielles) est considéré être une *DONNEE AUTONOME*
        // Cela est dû au fait que l'on passe 2 'TypedArray' (Uint8Array en fait) :
        // t2D = tf.tensor2d([encoder.encode("Franck"), encoder.encode("Barbier")]);
        // Le '6' de 'shape' ('[2, 6]') est calculé comme suit : '"Franck".length === 6' -> on perd le "r" final de "Barbier", problème !
        // console.info("shape: " + t2D.shape + // '[2, 6]'
        //     " - rank: " + t2D.rank + // '2'
        //     " - dtype: " + t2D.dtype // 'int32'
        // );
        // t2D.print();

        // Un tableau 'flat' requiert 'shape' :
        // t2D = tf.tensor2d(["Franck", "Barbier"], [2, 1]); // 2 valeurs...
        // console.info("shape: " + t2D.shape +
        //     " - rank: " + t2D.rank + // '2'
        //     " - dtype: " + t2D.dtype // 'string'
        // );
        // t2D.print();

        // 'dtype' est déduit par partir du type de '9' soit 'float32' :
        // t2D = tf.tensor2d([[9, "Java"], [11, "Java"], [4, "TypeScript"], [5, "TypeScript"]], [4, 2]);
        // console.info("shape: " + t2D.shape + // '[4, 2]'
        //     " - rank: " + t2D.rank +
        //     " - dtype: " + t2D.dtype // 'float32'
        // );
        // t2D.print(); // Les chaînes de caractères deviennent 'NaN' -> problème !

        // 'dtype' est déduit par partir du type de '"Java"' soit 'string' :
        t2D = tf.tensor([["Java", 9], ["Java", 11], [4, "TypeScript"], [5, "TypeScript"]]);
        console.info("shape: " + t2D.shape + // '[4, 2]'
            " - rank: " + t2D.rank +
            " - dtype: " + t2D.dtype // 'string'
        );
        t2D.print(); // Les nombres sont convertis en chaînes de caractères -> problème ?
    };
}

