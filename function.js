function metr_automat_table(x,s,s0,f,ie){
    let i,j;
    for(i=1;i<$('.tb_tp tr').length;i++){
         let str=$('.__tt').eq(i)
         if(s.indexOf(str.find('td').eq(2).html())==-1){
             s.push(str.find('td').eq(2).html())
             if(str.find('td').eq(1).find('input').val('checked')[0].checked){
                 s0.push(str.find('td').eq(2).html())
             }
             if(str.find('td').eq(0).find('input').val('checked')[0].checked){
                 f.push(str.find('td').eq(2).html())
             }
         }else{
             alert("l'etat dans la ligne "+i+" a été déja nomé")
         }     
    }
     var elm=$('.__tt').eq(0).find('td')
     for(j=3;j<elm.length;j++){
         var chrtrn=elm.eq(j).html();
         if(x.indexOf(chrtrn)==-1){
             x.push(chrtrn)
             for(i=1;i<$('.tb_tp tr').length;i++){
                 var allet,typ={
                     debart:'',
                     transtion:'',
                     fin:'',
                 }
                 let str=$('.__tt').eq(i)
                 if(str.find('td').eq(j).html()!=''){
                     let arr=str.find('td').eq(j).html().split(',')
                     let k=0,inarr=true;
                     while(k<arr.length){
                         if(s.indexOf(arr[k])==-1){
                             inarr=false 
                             break
                         }else{
                             k++
                         }
                     }
                     if(inarr){
                         allet=str.find('td').eq(j).html().split(',')
                         for(k=0;k<allet.length;k++){
                             typ={
                                 debart:'',
                                 transtion:'',
                                 fin:'',
                             }
                             typ.debart=str.find('td').eq(2).html()
                             typ.transtion=chrtrn
                             typ.fin=allet[k]
                             ie.push(typ)
                         }
                         
                     }else{
                         alert('vous avez entrer un état eroné dans ligne : '+i+' la colonne : '+j)
                     }
                 }
             }
         }else{
             alert('cette alphabet est déja utilisé')
         }
     }
}
function to_determinist(rnms,s0t,rnmf,tmpie){
    var tmps=[];
    var tmpsnrml=[];
    var tmpf=[];
    var wit=[];
    wit.push(s0[0]);
    let con=true;
    while(con){
        var els=wit.pop();
        if(els){
            var els1=els;
            tmpsnrml.push(els);
            els1=els1.split("").sort().toString().replace(",","");
            tmps.push(els1);
            var etat=els.split(',');
            for(var i=0;i<x.length;i++){
                var typ={
                    debart:'',
                    transtion:'',
                    fin:'',
                };
                var atnd=[];
                var tran=ie.filter(trans => trans.transtion === x[i])
                var consider=etat.length;
                for(var j=0;j<etat.length;j++){
                    var tran1=tran.filter( trans => trans.debart === etat[j])
                    if(tran1.length!=0){
                        for(k=0;k<tran1.length;k++){
                            if(atnd.indexOf(tran1[k].fin)==-1){
                                atnd.push(tran1[k].fin)
                            }
                        }
                    }else{
                        consider-=1; 
                    }
                    
                }
                if(consider>0){
                    var ettfin=atnd[0];
                    if($.inArray(atnd[0],f) !=-1){
                        var finale=true;
                    }else{
                        var finale=false;
                    }
                    for(var k=1;k<atnd.length;k++){
                        ettfin=ettfin+','+atnd[k]
                        if(!finale){
                            if($.inArray(atnd[k],f) !=-1){
                                var finale=true;
                            } 
                        }
                    }
                    var ett2=ettfin;
                    ett2=ett2.split("").sort().toString().replace(",","");
                    if(finale){
                        tmpf.push(ett2)
                    }
                    typ.debart=els1;
                    typ.transtion=x[i]
                    typ.fin=ett2
                    tmpie.push(typ)
                    if($.inArray(ett2,tmps)==-1 && $.inArray(ettfin,wit)==-1){
                        wit.push(ettfin)
                    }
                }
            }
            
        }else{
            con=false;
        }
    }
    for(var i=0;i<tmps.length;i++){
        rnms.push([tmpsnrml[i],("A"+i)]);
        for(var k=0;k<tmpie.length;k++){
            if(tmpie[k].debart==tmps[i]){
                tmpie[k].debart="A"+i;
            }
            if(tmpie[k].fin==tmps[i]){
                tmpie[k].fin="A"+i;
            }
        }
        if($.inArray(tmps[i],tmpf) !=-1){
            rnmf.push("A"+i)
        }
    }
    s0t.push("A0");
}
function take_mot_in(mot,as0,af,ai){
   var cuurneta=as0[0];
   var app=true;
   for(var i=0;i<mot.length;i++){
       $('._trace').append('<div class="__elm__dis"><sapn> '+cuurneta+' </span><span><span class="chr_op">'+mot[i]+'</span><span class="rltd"></span></span></div>')
       var tab=ai.filter(tran => (tran.debart===cuurneta && tran.transtion===mot[i]))
       if(tab.length>0){
            cuurneta=tab[0].fin
       }else{
            app=false;
            break;
       }
   }
    if(app){
        $('._trace').append('<div class="__elm__dis"><sapn> '+cuurneta+' </span></div>')
            if(af.indexOf(cuurneta)==-1){
                $('.rslt__fn').html("le mot n'est pas reconue par l'automate car la dernier état n'est pas final")
            }else{
                $('.rslt__fn').html("le mot est bien reconu par l'automat")
            }
    }else{
        $('.rslt__fn').html("on peut pas lire la letrre <strong>"+mot[i]+" </strong> apartire de l'état <strong> "+cuurneta+" </strong> l'automate ce block")
    }
}
function rendre_simple(xs,ss,ies,fs){
    var tmpx=[];
    for(var i=0;i<xs.length;i++){
        var k=0;
        if(xs[i].length>1){
            var tran=ies.filter(trans => trans.transtion === xs[i])
            ies=ies.filter(trans => trans.transtion !== xs[i])
            var xsx=xs[i].split("");
            xs.splice(i,1);
            for(var j=0;j<tran.length;j++){
                ss.push('p'+k);
                ies.push({debart:tran[j].debart,transtion:xsx[0],fin:'p'+k})
                if(xs.indexOf(xsx[0])==-1){
                    xs.push(xsx[0]);
                }
                k+=1;
                for(var l=1;l<xsx.length-1;l++){
                    ss.push('p'+k);
                    ies.push({debart:'p'+(k-1),transtion:xsx[l],fin:'p'+k})
                    k+=1;
                    if(xs.indexOf(xsx[l])==-1){
                        xs.push(xsx[l]);
                    }
                }
                if(xs.indexOf(xsx[xsx.length-1])==-1){
                    xs.push(xsx[xsx.length-1]);
                }
                ies.push({debart:'p'+(k-1),transtion:xsx[xsx.length-1],fin:tran[j].fin})
            }
        }
    }
    var tran=ies.find(trans => trans.transtion === '$');
    
    while(tran){
        var indx=ies.findIndex(tr =>( tr.transtion === "$" && tr.debart===tran.debart && tr.fin===tran.fin ));
        if(fs.indexOf(tran.fin)!=-1 && fs.indexOf(tran.debart)==-1){
            fs.push(tran.debart)
        }
        var tmpie=ies.filter(trans => trans.debart === tran.fin)
        for(var k=0;k<tmpie.length;k++){
            ies.push({debart:tran.debart,transtion:tmpie[k].transtion,fin:tmpie[k].fin})
        }
        ies.splice(indx,1);
        var tran=ies.find(trans => trans.transtion === '$');
    }
    var in$=xs.indexOf('$')
    if(in$!=-1){
        xs.splice( in$,1);
    }
    
    ie=ies;
}
function affiche_simple(s,x,ie,f,s0,text){
    var alpha='';
    for(var i=0;i<x.length;i++){
        alpha+='<td>'+x[i]+'</td>';
    }
    var total='';
    for(var i=0;i<s.length;i++){
        total+='<tr class="__tt1">';
        if(s0.indexOf(s[i])!=-1){
            total+='<td>état initial</td>';
        }else{
            total+='<td></td>';
        }
        if(f.indexOf(s[i])!=-1){
            total+='<td>état final</td>';
        }else{
            total+='<td></td>';
        }
        total+='<td>'+s[i]+'</td>'
        for(var j=0;j<x.length;j++){
            var tab=ie.filter(etat => (etat.debart === s[i] && etat.transtion === x[j]))
            if(tab.length>0){
                var et=tab[0].fin;
                for(var m=1;m<tab.length;m++){
                    et+=','+tab[m].fin
                }
                total+='<td>'+et+'</td>'
            }else{
                total+='<td> _ </td>'
            }
        }
        total+='</tr>'
    }
    var tabresult='<table class="tb_tp uk-table uk-table-striped"><tr class="__tt1"><td colspan="2"></td><td></td>'+alpha+'</tr>'+total+'</table>';
    $('.__rslt_op').append('<div class="result-reduction"></div>')
    $('.result-reduction').html(tabresult)
    $('.result-reduction').prepend('<div class="uk-panel uk-light uk-margin-small"><h5 class="uk-text-center@s uk-text-bolder gradiant-title">'+text+'</h5></div>')
}
function afiche_determi(sdtr,fdtr,s0dtr,iedtr,text){
    var alpha='';
    for(var i=0;i<x.length;i++){
        alpha+='<td>'+x[i]+'</td>';
    }
    var total='';
    for(var i=0;i<sdtr.length;i++){
        total+='<tr class="__tt1">';
        if(s0dtr.indexOf(sdtr[i][1])!=-1){
            total+='<td>état initial</td>';
        }else{
            total+='<td></td>';
        }
        if(fdtr.indexOf(sdtr[i][1])!=-1){
            total+='<td>état final</td>';
        }else{
            total+='<td></td>';
        }
        total+='<td>'+sdtr[i][1]+' { '+sdtr[i][0]+' } </td>'
        for(var j=0;j<x.length;j++){
            var tab=iedtr.filter(etat => (etat.debart === sdtr[i][1] && etat.transtion === x[j]))
            if(tab.length>0){
                var tr=tab[0].fin
                for(var m=1;m<tab.length;m++){
                    tr+=','+tab[m].fin
                }
                total+='<td>'+tr+'</td>'
            }else{
                total+='<td> _ </td>'
            }
        }
        total+='</tr>'
    }
    var tabresult='<table class="tb_tp1 uk-table uk-table-striped"><tr class="__tt1"><td colspan="2"></td><td></td>'+alpha+'</tr>'+total+'</table>';
    $('.__rslt_op').append('<div class="result-deter"></div>')
    $('.result-deter').html(tabresult)
    $('.result-deter').prepend('<div class="uk-panel uk-light uk-margin-small"><h5 class="uk-text-center@s uk-text-bolder gradiant-title">'+text+'</h5></div>')
   }
function auto_complet(xc,sc,iec){
    var xlen=xc.length;
    var addp=false;
    for(var i=0;i<sc.length;i++){
        for(var k=0;k<xlen;k++){
            var exist=iec.find(trans => (trans.transtion === xc[k]) && (trans.debart === sc[i][1]))
            if(!exist){
                iec.push({debart:sc[i][1],transtion:xc[k],fin:'p'})
                addp=true
            }
        }
    }
    if(addp){
        for(var k=0;k<xlen;k++){
            iec.push({debart:'p',transtion:xc[k],fin:'p'})
            
        }
        sc.push(['p','p'])
    }
}
function complement_automat(scm,fdtr){
    var tmpsc=[];
    for(var i=0;i<scm.length;i++){
        tmpsc.push(scm[i][1])
    }
    return tmpsc.filter(value => -1 == fdtr.indexOf(value))
}
function miroir_automate(xdtr,mie,sdtr,s0dtr){
    var tmpmi=[];
    var result=[];
    var lng=mie.length
    for(var i=0;i<lng;i++){
        var mir={debart:mie[i].fin,transtion:mie[i].transtion,fin:mie[i].debart}
        tmpmi.push(mir)
    }
    result.push(tmpmi)
    var s0tmp=[]
    if(s0dtr.length>1){
        for(var k=0;k<s0dtr.length;k++){
            tmpmi.push({debart:'n0',transtion:'$',fin:s0dtr[k]})
        }
        s0tmp.push('n0')
        sdtr.push(['n0','n0'])
        xdtr.push('$')
    }else{
        s0tmp.push(s0dtr[0])
    }
    result.push(s0tmp)
    return result;
}