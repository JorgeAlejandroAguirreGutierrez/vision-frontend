import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'filtroSerie',
    pure: false
})
export class FiltroSerie implements PipeTransform {
    transform(items: any[], filter: string): any {
        if (!items || !filter) {
            return items;
        }
        // filter items array, items which match and return true will be
        // kept, false will be filtered out
        return items.filter(item => item.serie.indexOf(filter) !== -1);
    }
}