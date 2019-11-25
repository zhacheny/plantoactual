import { Tasks, Partnumber, Plan, Operator, EarnedTimePP, Cell } from '/lib/collections.js';
var part = '';
var cell = '';
var old_pre_url = 'http://datuswes008/SOLIDWORKSPDM/Contains/EWS%20DB/Material/WM/Finished%20Goods?file='
var pre_url = "http://datuswes008/SOLIDWORKSPDM/EWS%20DB/Material/WM/Components?view=preview&file=";

function batchUpdateURL(data){
	let part = [];
	let old_XML = [];
	for (var i = data.length - 1; i >= 0; i--) {
		part.push(data[i].part);
		old_XML.push(data[i].XMLname);
	}
	// console.log('part', part, part.length);
	// console.log('XML',old_XML, old_XML.length);
	Meteor.call( 'partnumer_updatewithnewURL', part, old_XML, old_pre_url, pre_url, ( error, response ) => {
      if ( error ) {
        // console.log( error.reason );
        // throw new Meteor.Error('bad', 'stuff happened');
        Bert.alert( error.reason, 'danger', 'growl-top-right' );
      } else {
        Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
      }
    });
}

function download_data(data){
	const revised_data = JSON.parse(JSON.stringify(data));

	var CSVData = Papa.unparse(revised_data);
	var reportName = "Export_" + ".csv";

	// console.log(CSVData);
	var blob = new Blob([CSVData], 
        {type: "text/csv;charset=utf-8"});
		saveAs(blob, reportName);
}

Template.upload.onCreated( () => {
  	Template.instance().uploading = new ReactiveVar( false );
});


Template.upload.helpers({
  getcell(){
  	// part = Partnumber.find().fetch();
  	cell = Cell.find().fetch();
  	// return Partnumber.find();
  },
  uploading() {
    return Template.instance().uploading.get();
  }
});
Template.upload.events({
	'click .file-export': function(){
		let data = Partnumber.find().fetch();
		// console.log(data);
		download_data(data);
		Bert.alert( 'Exporting file...', 'success', 'growl-top-right' );
		// batchUpdateURL(data);
	},
	'change [name="operator"]' ( event, template ) {
	    template.uploading.set( true );

	    Papa.parse( event.target.files[0], {
	      header: true,
	      complete( results, file ) {
	        Meteor.call( 'parseUpload_operator', results.data, ( error, response ) => {
	          if ( error ) {
	            // console.log( error.reason );
	            // throw new Meteor.Error('bad', 'stuff happened');
	            Bert.alert( error.reason, 'danger', 'growl-top-right' );
	            template.uploading.set( false );
	          } else {
	            template.uploading.set( false );
	            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
	          }
	        });
	      }
	    });
	  },
  	'change [name="part"]' ( event, template ) {
	    template.uploading.set( true );

	    Papa.parse( event.target.files[0], {
	      header: true,
	      complete( results, file ) {
	        Meteor.call( 'parseUpload_part', results.data, ( error, response ) => {
	          if ( error ) {
	            // console.log( error.reason );
	            // throw new Meteor.Error('bad', 'stuff happened');
	            Bert.alert( error.reason, 'danger', 'growl-top-right' );
	            template.uploading.set( false );
	          } else {
	            template.uploading.set( false );
	            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
	          }
	        });
	      }
	    });
	  },
  	'change [name="updatepart"]' ( event, template ) {
	    template.uploading.set( true );

	    console.log(cell.length);
	    Papa.parse( event.target.files[0], {
	      header: true,
	      complete( results, file ) {
	        Meteor.call( 'parseUpdate_cell', results.data,cell, ( error, response ) => {
	          if ( error ) {
	            // console.log( error.reason );
	            // throw new Meteor.Error('bad', 'stuff happened');
	            Bert.alert( error.reason, 'danger', 'growl-top-right' );
	            template.uploading.set( false );
	          } else {
	            template.uploading.set( false );
	            Bert.alert( 'Upload complete!', 'success', 'growl-top-right' );
	          }
	        });
	      }
	    });
	  },
	// 'change [name="uploadCSV"]' ( event, template ) {
	//     template.uploading.set( true );
	//     var data = event.target.files[0];
	// 	var config = {
	// 		delimiter: "",	// auto-detect
	// 		newline: "",	// auto-detect
	// 	};
	// 	Papa.parse(data, {
	//       header: true,
	//       complete( results, file ) {
	//         // Handle the upload here.
	//         var data = results.data;	        
	//         for ( let i = 0; i < 1; i++ ) {
 //      			let item   = data[ i ]
	// 			let part   = data[ i ]['Assembly No'];
	// 			let cell   = data[ i ]['Work'];
	// 			let buildingnumber   = data[ i ]['buildingnumber'];
	// 			let ProductCode   = data[ i ]['Prod'];
	// 			let MinutesPP_one  = data[ i ]['1 Operator Minutes'];
	// 			let MinutesPP_two   = data[ i ]['2 Operator Minutes'];
	// 			let MinutesPP_three   = data[ i ]['3 Operator Minutes'];
	// 			let XMLname   = data[ i ]['Link'];
	// 			let PiecesPH_one  = MinutesPP_one ==''? '': '' + MinutesPP_one*60;
	// 			let PiecesPH_two   = MinutesPP_two ==''? '':'' + MinutesPP_two*60;
	// 			let PiecesPH_three = MinutesPP_three ==''? '':'' + MinutesPP_three*60;
	// 			Meteor.call('inserttest',part,cell,buildingnumber,XMLname,ProductCode,MinutesPP_one,
	// 	MinutesPP_two,MinutesPP_three,PiecesPH_one,PiecesPH_two,PiecesPH_three)
 //    //   			console.log(MinutesPP_one);
 //    //   			console.log(PiecesPH_one);
 //    //   			console.log(typeof(MinutesPP_two));
 //    //   			console.log(PiecesPH_two);

	// 			// console.log(typeof(MinutesPP_three));
	// 			// console.log(PiecesPH_three);

 //      		}
	//       }
	//     });
	//   }
});