import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'orderBy' })
export class OrderByPipe implements PipeTransform {
    public transform(values: Array<string>, args: string): Array<string> {
        if (values === null || !values) {
            return null;
        }
        values.sort((obj1: any, obj2: any) => {
            const a = obj1[args];
            const b = obj2[args];
            if (a < b) {
                return -1;
            } else if (a > b) {
                return 1;
            } else { return 0; }
        });
        return values;
    }
}
