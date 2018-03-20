import { Timer } from './../../../commun/services/Timer';
import { assert } from 'chai';

describe('chronometer', () => {

    it('should timer is between 1000 AND 1500 ms', () => {
        const timer = new Timer();
        timer.startTimer();
        assert(timer.timer >= Date.now());
    }).timeout(1200);
});
