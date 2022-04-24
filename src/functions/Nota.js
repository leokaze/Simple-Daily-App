import { uid } from "quasar";
const _ = require("lodash");

export default class Nota {
  dateCreated = null;
  dateModified = null;
  title = null;
  content = null;
  checked = false;
  color = 0;
  id = uid();

  constructor( nota = {} ) {
    Object.assign( this, nota );
  }

  setDate(){
    if( this.dateCreated === null ) this.dateCreated = new Date();
    this.dateModified = new Date();
  }

  setChecked( checked ) {
    this.checked = checked;
  }

  setColor( index ) {
    this.color = index;
  }

  getData(){
    const obj = {};
    Object.assign( obj, this );
    return _.cloneDeep( obj );
  }
}