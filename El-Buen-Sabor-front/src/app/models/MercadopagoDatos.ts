import { Base } from "./Base";


export class MercadopagoDatos implements Base{
    id!: number;
    identidicadorPago!: number;
    fechaCreacion!: Date;
    fechaAprobacion!: Date;
    metodoPago!: string;
    nroTarjeta!: string;
    estado!: string;
    preferenceId!: string;
    fechaBaja!: Date;

}