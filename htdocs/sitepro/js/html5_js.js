//Para obtener en un objeto la fecha y hora actual
const hoy = new Date();
//Aqui creamos un objeto que tiene la semana ya que con getFullYear obtenemos el año entero y con ,0,1 le decimos que queremos el primer dia del año
const inicioDeSemana = new Date(hoy.getFullYear(), 0, 1);
//aqui calculamos los dias que han pasado como nos lo devuelve en milisegundos hacemos esa multiplicacion
const dias = Math.floor((hoy - inicioDeSemana) / (24 * 60 * 60 * 1000));
//ahora que tenemos los dias, calculamos las semanas diviendo entre 7, el +1 es para no fallarle ya que el año empieza en cualquier dia de la semana
const num_semana = Math.ceil((dias + 1) / 7);
//Aqui le damos el formato correcto para la etiqueta
const semana_min = hoy.getFullYear() + '-W' + (num_semana < 10 ? '0' + num_semana : num_semana);
//Y aqui la mandamos
document.getElementById('week').setAttribute('min', semana_min);


document.querySelector('form.inputs').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url_a_validar = document.querySelector('[name="url"]').value;
    if (url_a_validar.length == 36) {
        console.log("Es de google meet");
        const regex = /^https:\/\/meet\.google\.com\/[a-zA-Z0-9]{3,}\-[a-zA-Z0-9]{4,}\-[a-zA-Z0-9]{3,}$/;
        if (regex.test(url_a_validar)) {
            console.log("La URL es válida para una reuión de Meet");

            document.getElementById('imagen').setAttribute('src', '../gallery/meet.jpeg');
        } else {
            console.log("La URL no coincide con una reuinion de Meet");
        }
    } else if (url_a_validar.length > 36 || url_a_validar.length == 74) {
        console.log("ES de Zoom");
        const regex = /^https:\/\/us[0-9]{2,}web\.zoom\.us\/j\/[0-9]{11,}\?pwd=[a-zA-Z0-9]{30,}\.[0-9]{1,}$/;
        if (regex.test(url_a_validar)) {
            console.log("La URL es válida para una reuinión de Meet");
            document.getElementById('imagen').setAttribute('src', '../gallery/zoom.jpeg');
        } else {
            console.log("La URL no coincide con una reuinion de Zoom");
        }

    } else {
        alert("La URL que ingreso no es valida");
    }
    calcularsemanasrestantes();
});


function calcularsemanasrestantes() {
    const semana_seleccionanda = document.querySelector('[name="week"]').value;

    const [año, semana] = semana_seleccionanda.split('-');

    const num_semana_selec = parseInt(semana.replace('W', ''));
    console.log("Semana minima " + num_semana);
    console.log("Semana seleccionada " + num_semana_selec);
    const semana_restante = (num_semana_selec - num_semana);

    if (semana_restante == 0) {
        const resultadosDiv = document.getElementById('semanas_faltantes');

        let contenido = '';

        contenido += `<h3>Las reuiniones son esta semana</h3>`;
        resultadosDiv.innerHTML = '';
        resultadosDiv.innerHTML = contenido;
    } else {
        const resultadosDiv = document.getElementById('semanas_faltantes');

        let contenido = '';

        contenido += `<h3>Semanas restantes para las reuniones ${semana_restante}</h3>`;
        resultadosDiv.innerHTML = '';
        resultadosDiv.innerHTML = contenido;
    }
}