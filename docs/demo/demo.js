import mq from 'js-mq';
import attrs from '../../src/js-mq-attrs';

mq.register([
    {name: 'xs', query: '(max-width: 767px)'},
    {name: 'sm', query: '(min-width: 768px) and (max-width: 991px)'},
    {name: 'md', query: '(min-width: 992px) and (max-width: 1199px)'},
    {name: 'lg', query: '(min-width: 1200px)'}
]);

console.log('mq: ', mq);
console.log('attrs: ', attrs);