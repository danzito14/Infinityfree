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

//funcion para validar la url y mostrar la imagen correspondiente
document.querySelector('form.inputs').addEventListener('submit', async (e) => {
    e.preventDefault();
    //obtiene el valor del input URL y lo guarda en una variable
    const url_a_validar = document.querySelector('[name="url"]').value;
    //compara el tamaño para saber si es de google meet o de zoom la url
    if (url_a_validar.length == 36) {
        console.log("Es de google meet");
        //expresion regular para validar la URL si coincide con el tamaño de google meet
        const regex = /^https:\/\/meet\.google\.com\/[a-zA-Z0-9]{3,}\-[a-zA-Z0-9]{4,}\-[a-zA-Z0-9]{3,}$/;
        if (regex.test(url_a_validar)) {

            //muestra en consola que la url es valida y en pantalla muestra la imagen correspondiente
            console.log("La URL es válida para una reuión de Meet");

            document.getElementById('imagen').setAttribute('src', '../gallery/meet.jpeg');
            calcularsemanasrestantes();
        } else {
            //mensaje de error
            Swal.fire({
                title: "URL incorrecta",
                text: "Error la URL ingresada no coincide con una reuinion de Google Meet",
                icon: "error",
                background: "#1E1E2F",
                color: "#ffffff",
                confirmButtonColor: "#3085d6",
                customClass: {
                    popup: 'swal-custom-bg'
                }
            });

        }

    } else if (url_a_validar.length > 36 || url_a_validar.length == 74) {
        console.log("ES de Zoom");

        //expresion regular para validar la URL si coincide con el tamaño de zoom
        const regex = /^https:\/\/us[0-9]{2,}web\.zoom\.us\/j\/[0-9]{11,}\?pwd=[a-zA-Z0-9]{30,}\.[0-9]{1,}$/;
        if (regex.test(url_a_validar)) {
            //muestra en consola que la url es valida y en pantalla muestra la imagen correspondiente
            console.log("La URL es válida para una reuinión de Meet");
            document.getElementById('imagen').setAttribute('src', '../gallery/zoom.jpeg');
            calcularsemanasrestantes();
        } else {
            //mensaje de error
            Swal.fire({
                title: "URL incorrecta",
                text: "Error la URL ingresada no coincide con una reuinion de Zoom",
                icon: "error",
                background: "#1E1E2F",
                color: "#ffffff",
                confirmButtonColor: "#3085d6",
                customClass: {
                    popup: 'swal-custom-bg'
                }
            });
        }

    } else {
        //mensaje de error que sale si se ingreso una url pero no coincidio con ninugna
        Swal.fire({
            title: "URL incorrecta",
            text: "Error la URL ingresada no coincide con una reuinion de Zoom o Google Meet",
            icon: "error",
            background: "#1E1E2F",
            color: "#ffffff",
            confirmButtonColor: "#3085d6",
            customClass: {
                popup: 'swal-custom-bg'
            }
        });
    }

});

//calcula las semanas restantes y muestra los datos ingresados
function calcularsemanasrestantes() {
    //obtiene los datos ingresados del time, week y nombre
    const semana_seleccionanda = document.querySelector('[name="week"]').value;
    const nombre_reunion = document.querySelector('[name="nombre"]').value;
    const hora = document.querySelector('[name="time"]').value;
    //separa el las letras de los nuemors de week
    const [año, semana] = semana_seleccionanda.split('-');

    //calculamos las semanas faltantes
    const num_semana_selec = parseInt(semana.replace('W', ''));
    console.log("Semana minima " + num_semana);
    console.log("Semana seleccionada " + num_semana_selec);
    const semana_restante = (num_semana_selec - num_semana);

    //si la semana actual es la seleccionada indicara eso si no mostrara las semanas faltantes
    if (semana_restante == 0) {
        const resultadosDiv = document.getElementById('semanas_faltantes');
        //Ruta si la semana seleccionada es la semana actual
        let contenido = '';

        contenido += `<h3>Las reuiniones son esta semana a las  ${hora}</h3>`;
        resultadosDiv.innerHTML = '';
        resultadosDiv.innerHTML = contenido;
    } else {
        const resultadosDiv = document.getElementById('semanas_faltantes');
        //ruta si la semana seleccionada no es la actual, en otras palabras muestra la semanas faltantes para la reuniones
        let contenido = '';
        //muestra las semanas faltantes el nombre de la reunion y la hora
        contenido += `<h3> ${semana_restante} semanas para las reuniones ${nombre_reunion} a las  ${hora} en</h3>`;
        resultadosDiv.innerHTML = '';
        resultadosDiv.innerHTML = contenido;
    }
}