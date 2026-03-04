 let nota1 = parseFloat(prompt("Primeira nota:"));
    let nota2 = parseFloat(prompt("Segunda nota: "));

    if (isNaN(nota1) || nota1 < 0 || isNaN(nota2) || nota2 < 0) {
      console.log("Valor inválido!");
    } else {
      const media = (nota1 + nota2) / 2;

      if (media === 10) {
        console.log(`${media} Aprovado com mérito!`);
      } else if (media >= 7) {
        console.log(`${media} Aprovado`);
      } else {
        console.log(`${media} Reprovado!`);
      }
    }

