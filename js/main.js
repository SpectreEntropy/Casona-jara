/* =====================================
   CASA ANDINA JARA
   MAIN JAVASCRIPT
===================================== */

// =====================================
// CONFIGURACIÓN WHATSAPP
// =====================================

const numeroHotel = "51935139031";

// =====================================
// CONFIGURACIÓN GOOGLE ANALYTICS
// =====================================

// CAMBIO 1: Evitar que un error de Google Analytics
// interrumpa el funcionamiento de la página.

function registrarEventoGA4(nombreEvento, parametros = {}) {

    try {

        if (typeof window.gtag === "function") {

            window.gtag("event", nombreEvento, parametros);

        }

    } catch (error) {

        console.warn(
            "No se pudo registrar el evento GA4:",
            nombreEvento,
            error
        );

    }

}

// =====================================
// VALIDAR PROMOCIÓN AGOSTO
// =====================================

function validarPromocionAgosto(fechaEntrada, fechaSalida) {

    // CAMBIO 2: Comparar fechas sin errores de zona horaria.

    const anio = fechaEntrada.slice(0, 4);

    if (
        fechaEntrada >= `${anio}-08-01` &&
        fechaSalida <= `${anio}-08-31`
    ) {
        return "15% descuento - Promoción especial agosto";
    }

    return "No aplica";

}

// =====================================
// MENÚ MÓVIL
// =====================================

const menuButton = document.querySelector(".menu-mobile");
const navigation = document.querySelector(".navigation");

if (menuButton && navigation) {

    menuButton.addEventListener("click", () => {

        navigation.classList.toggle("active");

    });

}

// =====================================
// CERRAR MENÚ
// =====================================

document.querySelectorAll(".navigation a").forEach(link => {

    link.addEventListener("click", () => {

        if (navigation) {

            navigation.classList.remove("active");

        }

    });

});

// =====================================
// ACTIVAR PROMOCIÓN DESDE BOTÓN
// =====================================

const botonPromocion = document.querySelector("#btnPromocion");
const avisoPromocion = document.querySelector("#avisoPromocion");

// CAMBIO 3: Corregir el cierre de la función,
// conservar el aviso de promoción y registrar el evento GA4.

if (botonPromocion) {

    botonPromocion.addEventListener("click", () => {

        if (avisoPromocion) {

            avisoPromocion.style.display = "block";

        }

        registrarEventoGA4("click_promocion", {
            promotion_name: "descuento_agosto"
        });

    });

}

// =====================================
// HEADER SCROLL
// =====================================

const header = document.querySelector(".header");

// CAMBIO 4: Verificar que exista el encabezado.

if (header) {

    window.addEventListener("scroll", () => {

        header.classList.toggle(
            "scrolled",
            window.scrollY > 80
        );

    });

}

// =====================================
// SCROLL SUAVE
// =====================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        const id = this.getAttribute("href").slice(1);
        const target = document.getElementById(id);

        if (target) {

            e.preventDefault();

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});

// =====================================
// FORMULARIO DE RESERVA
// =====================================

const form = document.querySelector(".reservation-box form");

const inputEntrada = document.querySelector("#fechaEntrada");
const inputSalida = document.querySelector("#fechaSalida");

// =====================================
// CONFIGURACIÓN DE FECHAS
// =====================================

function fechaLocalISO(fecha) {

    return fecha.getFullYear() + "-" +
        String(fecha.getMonth() + 1).padStart(2, "0") + "-" +
        String(fecha.getDate()).padStart(2, "0");

}

const fechaMinima = fechaLocalISO(new Date());

// CAMBIO 5: La fecha de salida debe ser como mínimo
// el día siguiente a la fecha de llegada.

function actualizarFechaSalida() {

    if (!inputEntrada || !inputSalida) {
        return;
    }

    if (!inputEntrada.value) {

        inputSalida.min = fechaMinima;

        return;

    }

    const [anio, mes, dia] = inputEntrada.value
        .split("-")
        .map(Number);

    const siguienteDia = new Date(
        anio,
        mes - 1,
        dia + 1
    );

    inputSalida.min = fechaLocalISO(siguienteDia);

    if (
        inputSalida.value &&
        inputSalida.value < inputSalida.min
    ) {

        inputSalida.value = "";

    }

}

if (inputEntrada && inputSalida) {

    inputEntrada.min = fechaMinima;

    actualizarFechaSalida();

    inputEntrada.addEventListener(
        "change",
        actualizarFechaSalida
    );

}

// =====================================
// SELECCIONAR HABITACIÓN DESDE TARJETA
// =====================================

// CAMBIO 6: Esta función ahora está fuera del submit.
// Permite seleccionar automáticamente una habitación
// desde el momento en que se carga la página.

const botonesHabitacion = document.querySelectorAll(
    ".btn-reservar-habitacion"
);

const selectHabitacion = document.querySelector("#habitacion");

botonesHabitacion.forEach(boton => {

    boton.addEventListener("click", () => {

        const habitacion = boton.dataset.habitacion;

        if (selectHabitacion && habitacion) {

            const normalizar = texto =>
                texto.trim().toLowerCase();

            const opcion = Array.from(
                selectHabitacion.options
            ).find(op =>

                normalizar(op.value) ===
                normalizar(habitacion) ||

                normalizar(op.textContent) ===
                normalizar(habitacion)

            );

            if (opcion) {

                selectHabitacion.value = opcion.value;

            }

        }

    });

});

// =====================================
// ENVÍO DE SOLICITUD A WHATSAPP
// =====================================

if (form) {

    form.addEventListener("submit", (e) => {

        e.preventDefault();

        const nombre = document.querySelector("#nombre")
            .value.trim();

        const correo = document.querySelector("#correo")
            .value.trim();

        const telefono = document.querySelector("#telefono")
            .value.trim();

        const fechaEntrada = document.querySelector(
            "#fechaEntrada"
        ).value;

        const fechaSalida = document.querySelector(
            "#fechaSalida"
        ).value;

        const huespedes = document.querySelector(
            "#huespedes"
        ).value;

        const habitacion = document.querySelector(
            "#habitacion"
        ).value;

        const mensajeCliente = document.querySelector(
            "#mensaje"
        ).value.trim();

        // =====================================
        // VALIDACIÓN DE CAMPOS OBLIGATORIOS
        // =====================================

        if (
            !nombre ||
            !correo ||
            !telefono ||
            !fechaEntrada ||
            !fechaSalida
        ) {

            alert("Completa todos los campos obligatorios.");

            return;

        }

        // VALIDAR FECHA DE LLEGADA

        if (fechaEntrada < fechaMinima) {

            alert(
                "La fecha de llegada no puede ser anterior a hoy."
            );

            return;

        }

        // VALIDAR FECHA DE SALIDA

        if (fechaSalida <= fechaEntrada) {

            alert(
                "La fecha de salida debe ser posterior a la fecha de llegada."
            );

            return;

        }

        // VALIDAR PROMOCIÓN

        const promocion = validarPromocionAgosto(
            fechaEntrada,
            fechaSalida
        );

        // =====================================
        // GENERAR MENSAJE DE WHATSAPP
        // =====================================

        const mensaje = `Hola Casa Andina Jara 👋

Deseo realizar una solicitud de reserva.

👤 Nombre:
${nombre}

📧 Correo:
${correo}

📱 Teléfono:
${telefono}

📅 Fecha de llegada:
${fechaEntrada}

📅 Fecha de salida:
${fechaSalida}

👥 Huéspedes:
${huespedes}

🏠 Habitación:
${habitacion}

🎁 Promoción:
${promocion}

💬 Mensaje:
${mensajeCliente || "Sin mensaje adicional"}

Quedo atento a su confirmación.`;

        const url = "https://wa.me/" +
            numeroHotel +
            "?text=" +
            encodeURIComponent(mensaje);

        // =====================================
        // REGISTRAR SOLICITUD EN GOOGLE ANALYTICS
        // =====================================

        // CAMBIO 7: Registrar únicamente formularios
        // válidos, sin enviar información personal a GA4.

        registrarEventoGA4("reservation_request", {
            method: "whatsapp"
        });

        // =====================================
        // ABRIR WHATSAPP
        // =====================================

        // CAMBIO 8: Si el navegador bloquea la nueva
        // ventana, abrir WhatsApp en la pestaña actual.

        const ventana = window.open(url, "_blank");

        if (!ventana) {

            window.location.href = url;

            return;

        }

        // LIMPIAR FORMULARIO

        form.reset();

        actualizarFechaSalida();

    });

}

// =====================================
// ANIMACIONES
// =====================================

const elements = document.querySelectorAll(
    ".room-card, .experience-grid div, .promotion-box, .reservation-box"
);

// CAMBIO 9: Evitar errores si el navegador
// no soporta IntersectionObserver.

if (typeof IntersectionObserver === "function") {

    const observer = new IntersectionObserver(

        (entries) => {

            entries.forEach(entry => {

                if (entry.isIntersecting) {

                    entry.target.classList.add("show");

                }

            });

        },

        {
            threshold: 0.15
        }

    );

    elements.forEach(element => {

        element.classList.add("hidden");

        observer.observe(element);

    });

}
