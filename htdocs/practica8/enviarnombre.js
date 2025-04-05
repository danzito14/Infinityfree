class enviarnombre {
    constructor(nombrecookie) {
        // Asignar el nombre de la cookie al crear la instancia
        this.nombrecookie = nombrecookie;
    }

    recibirnombrecookie(nombrecookie) {
        this.nombrecookie = nombrecookie;
    }

    enviarnombrecookie() {
        return this.nombrecookie;
    }
}
