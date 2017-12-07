import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'NumberToStringFormat' })
export class NumberToStringPipe implements PipeTransform {
    constructor() {
        //  super()
    }
    transform(
        valor: number,
        precision?: number,
        prefix?: string,
        sufix?: string,
        decimalSeparator?: string,
        millionSeparator?: string
    ): string {
        try {
            //validate parameter
            if (!valor) valor = 0;
            if (!prefix) prefix = "";
            if (!sufix) sufix = "";
            if (!decimalSeparator) decimalSeparator = ",";
            if (!millionSeparator) millionSeparator = ".";

            //trasnform in string 
            let sValor: string = valor.toString();

            //split in decimal and int
            let sDecimal: string = "";
            let sInteger: string = "";

            sInteger = sValor.split(".")[0];
            if (precision > 0) {
                sDecimal = sValor.split(".")[1];
                if (!sDecimal) sDecimal = "";

                if (sDecimal.length > precision) {
                    sDecimal = sDecimal.substring(0, precision);
                }
                while (sDecimal.length < precision) {
                    sDecimal = sDecimal + "0";
                }
            }

            //split decimal in tri
            //let tempString: string
            let millionList: string[] = []
            while (sInteger.length != 0) {
                if (sInteger.length > 3) {
                    millionList.push(sInteger.substring(sInteger.length - 3));
                    sInteger = sInteger.substring(0, sInteger.length - 3)
                } else {
                    millionList.push(sInteger);
                    sInteger = "";
                }
            }
            //concat int with "point"
            millionList = millionList.reverse();
            sInteger = millionList.join(millionSeparator);

            //concat decimal with "comma"
            if (sDecimal.length == 0) {
                sValor = prefix + sInteger + sufix;
            } else {
                sValor = prefix + sInteger + decimalSeparator + sDecimal + sufix;
            }
            return sValor;
        }
        catch (error) {
            // this.loggingErrorHandler.handleError(
            //     error,
            //     "1000",
            //     "NumberToStringPipe_transform",
            //     "Front Unico",
            //     "ERROR"
            // );
        }
    }
}
