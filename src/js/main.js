/*
* Project: Webdevtest (Scientific Games)
* Author: Bálint Szabó
*
* Javascript framework: Vue.js @2.5.17 | https://vuejs.org
* Used packages: Moment.js @2.22.2 | http://momentjs.com/
*/

const app = new Vue({
    el: '#webdevtest-app',
    data: {
        server_time: null,
        promotion_objects: [],
        params: null,
        promo: null 
    },
    methods: {
        nextDrawingDate: function (drawings) {
            let next = null; 

            // If the drawings from the server are not ordered properly by 'drawing_date' 
            drawings.slice(0).sort(function(a,b) { return a.drawing_date - b.drawing_date; });
            
            // Find next 'drawing_date' in 'drawings' according to 'server_time'  
            drawings.some(function(drawing) {
                return ( drawing.drawing_date >= app.server_time ) ? (next = drawing.drawing_date, true) : false;
            });

            return (next) ? moment(next).format('LLL') : 'All Drawing Dates Are Passed';
        },
        nextEntryDeadline: function (drawings) {
            let next = null; 

            // If the drawings from the server are not ordered properly by 'entry_deadline' 
            drawings.slice(0).sort(function(a,b) { return a.entry_deadline - b.entry_deadline; });
            
            // Find next 'entry_deadline' in 'drawings' according to 'server_time'  
            drawings.some(function(drawing) {
                return ( drawing.entry_deadline >= app.server_time ) ? (next = drawing.entry_deadline, true) : false;
            });

            return (next) ? moment(next).format('dddd, MMMM D[,] YYYY') : 'All Entry Deadline Are Passed';
        },
        moment: function (args) {
            return moment(args);
        }
    },
    created () {
        
        // Process and store URL parameters
        const uri = window.location.search.substring(1); 
        this.params = new URLSearchParams(uri);
       
        // Loading promotion data from server on startup
        fetch('./js/webdevtest-data.js')
        .then(response => response.json())
        .then(json => {
            this.server_time        = json.server_time;
            this.promotion_objects  = json.promotion_objects;
            //  console.log('Server time: ' + this.server_time);

            // Set promotion from promo paramter     
            if(this.params.get("promo")) {
                const prid = this.params.get("promo").match(/\d+/)[0];
                this.promo = (this.promotion_objects.length >= prid) ? this.promotion_objects[prid-1] : null;
            }    

        });

    }
})
