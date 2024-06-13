//Elements
let container = document.querySelector(".container")
let lis = document.querySelectorAll("ul  li");
let slide_bar = document.querySelector(".slide-bar");
let check = document.querySelector(".check");
let txt = document.querySelector(".check-us-name");
let sub_btn = document.querySelector(".submit");

//Global Vars Is Very Important To use in many projects as => dependant vars
let currentIndex = 0;
let trueAnswer = 0;
let falseAnswer = 0;
let missedAnswer = 0;
let set_interval, startTime, endTime;
let duration = 10;
let txtArray = [];

// create input submit $$ value

//Appear Page Content
lis.forEach(li =>{
    li.addEventListener("click", () => {
        lis.forEach(e => e.classList.remove("active"));
        li.classList.add("active")
        
        if(li.classList.contains("active")) {
            currentIndex = 0;
            trueAnswer = 0;
            container.innerHTML = '';
            container.classList.remove('start-qz')
            // check.classList.add('active')
            txtArray = [];
            subUsName(li)
            //You Must Must Must Clear The interval to prevent any masking the previous and the next quizAreas
            trueAnswer = 0;
            falseAnswer = 0;
            clearInterval(set_interval)
        }
    })
})

function quesLink(link) {
    let request = new XMLHttpRequest();
    request.onload = function() {
        let obj = JSON.parse(this.responseText)
        let objLength = Object.keys(JSON.parse(this.responseText)).length

            if(this.status === 200 && this.readyState === 4) {
                pageContent(obj, objLength); 
            }
    };

    request.open("GET", link, true)
    request.send();
}

function pageContent(content, length) {
    for (let index = 0; index < length; index++) {
        const quizApp = document.createElement("div")
        quizApp.className = 'quiz-app'
        container.appendChild(quizApp)

        container.children[0].style.display = 'block' 
        setTimeout(() => container.children[0].classList.add("active"),10)

        // quizApp.style.display = 'block' 
        // setTimeout(() => quizApp.classList.add("active"),2)

        let category = document.createElement("div")
        category.className = 'category'

        let subjectName = document.createElement("div")
        subjectName.className = 'sub-name';

        let subNameChild = document.createElement("span")
        subNameChild.className = 'subject-name'

        lis.forEach(li => {
            if(li.classList.contains("active")) {
                subNameChild.innerHTML = `${li.textContent} ${index + 1}`
            }
        })
        
        subjectName.appendChild(subNameChild)
        category.appendChild(subjectName)
        
        let quesNumbers = document.createElement("div")
        quesNumbers.innerHTML = `Questions Number <span class='number'>${length}</span>`
        category.appendChild(quesNumbers)
        
        quizApp.appendChild(category);
        
        let quizArea = document.createElement("div")
        quizArea.className = 'quiz-area'

        let quesTitle = document.createElement("h3")
        quesTitle.className = 'ques'
        quesTitle.textContent += content[index].title
        quizArea.appendChild(quesTitle)

        const answers = document.createElement("div")
        answers.className = `answers`;

        for(let i = 1; i <= 4; i++) {
            const answer = document.createElement("div")
            answer.className = `answer`
            
            let circle = document.createElement("span")
            circle.className = 'circle'
            
            let answerVal = document.createElement("div")
            answerVal.className = 'answer-val';
            answerVal.textContent += `${content[index][`answer-${i}`].trim()}`;
            answerVal.setAttribute("rt-answer", content[index][`rt-answer`].trim())

            answer.appendChild(circle)
            answer.appendChild(answerVal)
            
            answers.appendChild(answer)
            if(answerVal.textContent === "undefined") {
                answerVal.parentElement.style.display = 'none';
            }
            quizArea.appendChild(answers)
            quizApp.appendChild(quizArea)

        };
        setTimeout(() =>{            
            if(quizApp.classList.contains("active")) {
                let anss = document.querySelectorAll(".answer") 
                anss.forEach((ans, j) => {
                    ans.addEventListener("click",() => {
                        clearInterval(set_interval);
                        [...answers.children].forEach(e => e.classList.remove("selected"));
                        ans.classList.add("selected")
                        
                        if(ans.classList.contains("selected")) {
                            //Muse increase
                            currentIndex++;
                            let aParent = ans.parentElement.parentElement.parentElement
                            let tmr = aParent.children[1].lastElementChild
                            if(currentIndex < length) {
                                aParent.nextElementSibling.style.display = 'block'
                                setTimeout(() => {
                                    //Must check the current answer Before add the next element active class
                                    checkAnswers(ans);
                                    checkOtherAnswers(ans.parentElement)

                                    aParent.nextElementSibling.classList.add("active") 
                                    mainCountDown(duration, aParent.nextElementSibling.children[1], length) 
                                    console.log(currentIndex)
                                },30)
                            } else {
                                checkAnswers(ans);
                                checkOtherAnswers(ans.parentElement)
                                
                                endTime = Date.now()
                                console.log(new Date(endTime).toLocaleTimeString())
                                let elapsed = endTime - startTime;
                                
                                console.log(Math.round((elapsed / 1000)))
                                createRanking(length)
                                
                                let true_calc = document.querySelector(".result-calc .true-calc") 
                                let filter_true_number = true_calc.textContent.split(" ").map(e => +e ).filter(e => +e).join('')
                                Array.from(lis).filter(l => l.classList.contains('active')).map(l => {
                                    putElapsedTme(elapsed, l, txtArray, filter_true_number, length)
                                })
                            }
                            tmr.innerHTML = `Final Result is <span>${ans.children[1].getAttribute("rt-answer")}</span>` 
                            tmr.style.cssText = 'font-size:15px;'
                            
                        }
                    })
                })
            }
        } ,50)
    }
    setTimeout(()=> {
            let quizArea = document.querySelector(".quiz-area")
            mainCountDown(duration, quizArea, length)
        } )
}

function mainCountDown(duration, quizArea,length) {
    let mt = Math.trunc(duration / 60)
    let sc = Math.trunc(duration % 60)
    // let timerParent = document.querySelector(".timerDiv")
    
    // let timer = document.querySelectorAll(".timer")
    let timer = document.createElement("div") 
    timer.className = 'timer' 
    quizArea.appendChild(timer);

    let minutes = document.createElement("span") 
    minutes.className = 'mints'
    
    timer.appendChild(minutes)
    
    let colon = document.createTextNode(":");
    timer.appendChild(colon)
    
    let seconds = document.createElement("span") 
    seconds.className = 'scs'
    
    timer.appendChild(seconds)
    
    dwn(sc, seconds, mt, minutes)
    set_interval = setInterval(() => {
        if(sc > 0) {
            sc--;
            dwn(sc, seconds, mt, minutes)
        } else if(sc === 0 && mt !== 0) {
            sc = 59
            mt--;
            dwn(sc, seconds, mt, minutes)
        } else if(sc === 0 && mt === 0) {
            clearInterval(set_interval);
            setTimeout(() => {
                [...quizArea.children[1].children].forEach(chl => {
                    if(chl.children[1].getAttribute("rt-answer") === chl.children[1].textContent) {
                        chl.classList.add('mss')
                        chl.firstElementChild.style.cssText = 'border: 2px solid #c621f3bf; background-color: #c621f3bf;'
                        let true_false_answer = document.createElement("span")                    
                        true_false_answer.innerHTML = "&#10004;"
                        chl.appendChild(true_false_answer)
                    } 
                    timer.innerHTML = `Final Result is <span>${chl.children[1].getAttribute("rt-answer")}</span>` 
                    timer.style.cssText = 'font-size:15px;'

                });
                [...quizArea.children[1].children].filter(chl => {
                    return chl.children[1].getAttribute("rt-answer") !== chl.children[1].textContent
                }).map(chl => chl.classList.add('finished-ques'))

                //Muse increase
                currentIndex++;
                if(currentIndex < length) {
                    console.log(currentIndex)
                    quizArea.parentElement.nextElementSibling.style.display = 'block'
                    setTimeout(() => {
                        quizArea.parentElement.nextElementSibling.classList.add("active") 
                        mainCountDown(duration, quizArea.parentElement.nextElementSibling.children[1], length) 
                    },70)
                } else {
                    endTime = Date.now()
                    let elapsed = endTime - startTime;
                    console.log(new Date(endTime).toLocaleTimeString())
                    console.log(Math.round((elapsed / 1000)))
                    createRanking(length)

                    let true_calc = document.querySelector(".result-calc .true-calc") 
                    let filter_true_number = true_calc.textContent.split(" ").map(e => +e ).filter(e => +e).join('')
                    Array.from(lis).filter(l => l.classList.contains('active')).map(l => {
                        putElapsedTme(elapsed, l, txtArray, filter_true_number)
                    })
                }
            },60)
        } 
    }, 1000)    
    // seconds.textContent = sc ? sc >= 10 : `0${sc} ? i don't Know why this is not valid`
}

function dwn(sc, seconds, mt, minutes) {
    if(sc >= 10) {
        seconds.textContent = sc
    } else {
        seconds.textContent = `0${sc}`
    }

    if(mt >= 10) {
        minutes.textContent = mt
    } else {
        minutes.textContent = `0${mt}`
    }
};

function checkAnswers(a) {
    // let true_false_answer = document.createElement("span")
    // let clonedSign = true_false_answer.cloneNode(true)
    let true_false_answer = document.createElement("span")
    let clonedSign = true_false_answer.cloneNode(true);
    
    if(a.children[1].textContent === a.children[1].getAttribute("rt-answer")) {
        trueAnswer++;
        a.classList.add("true")
        true_false_answer.innerHTML = "&#10004;" 
        a.appendChild(true_false_answer) 
    } else if(a.children[1].textContent !== a.children[1].getAttribute("rt-answer")){
        falseAnswer++;
        a.classList.add("false")
        true_false_answer.innerHTML = "&#10006;"
        a.appendChild(true_false_answer) 
        
        //You Must Write the Updated Class to Recognize The Latest Answer
        let trueAnswer = document.querySelectorAll(`.active .answer`)
        trueAnswer.forEach(t =>{
            if(!t.classList.contains("selected") && t.children[1].textContent === t.children[1].getAttribute("rt-answer")) {
                t.classList.add("true")
                clonedSign.innerHTML = "&#10004;" 
                t.appendChild(clonedSign) 
            }
        })
    }
}

function checkOtherAnswers(answers) {
    let chooseNot_trueFalse = [...answers.children].filter(e => {
        return !e.classList.contains("true") && !e.classList.contains("false")
    })
    chooseNot_trueFalse.forEach(e => {
        e.classList.add("finished-ques")
    })          
}


function createRanking(length) {
    let result_calc = document.createElement("div")
    result_calc.className = 'result-calc' 

    setTimeout(() => {
        result_calc.classList.add('active') 
    },100)
    
    let true_calc = document.createElement("h3") 
    true_calc.className = 'true-calc'

    true_calc.innerHTML = `True: ${trueAnswer}`
    result_calc.appendChild(true_calc)
    
    let false_calc = document.createElement("h3") 
    false_calc.className = 'false-calc'

    false_calc.innerHTML = `False: ${falseAnswer}`

    result_calc.appendChild(false_calc)

    let missed_calc = document.createElement("h3") 
    missed_calc.className = 'missed-calc'

    missed_calc.innerHTML = `Missed: ${length - (trueAnswer + falseAnswer)}`

    result_calc.appendChild(missed_calc)

    container.appendChild(result_calc) 


};


function subUsName(li) {
    check.className = `check ${li.textContent}`
    check.classList.add('active')

    //push the l elements in array
    if(localStorage.getItem(`${li.textContent}`)) {
        txtArray.push(...JSON.parse(localStorage.getItem(`${li.textContent}`)))
    }
    
    Array.from(lis).filter(l => !l.classList.contains('active')).map(l => 
        l.addEventListener('click', function() {
            if(document.querySelector('table') ) {
                document.querySelector('table').style.display = 'none'
            }

            if(document.querySelector('.start-qz') && document.querySelector('.stop-qz')) {
                document.querySelector('.start-qz').style.display = 'none'
                document.querySelector('.stop-qz').style.display = 'none'
            }
        }))


        //create start btn
        let startBtn = document.createElement('button')
        startBtn.textContent = 'Start Quiz'
        startBtn.className = 'start-qz'
        
        //create start btn
        let endBtn = document.createElement('button')
        endBtn.textContent = 'Stop Quiz'
        endBtn.className = 'stop-qz'

        check.addEventListener("submit", () => {
        let filterLi = Array.from(lis).filter(l => l.classList.contains('active')).map(l => l.textContent).join("")
        if(txt.value.trim().split(" ").length >= 2) {
            txtArray.push({
                usName: txt.value.toLowerCase()
            }) 
            
            let except = txtArray.filter((_, n,arr) => {
                return n < (arr.length - 1)
            })

            except.forEach(e => {
                if(txt.value.toLowerCase() === e["usName"]) {
                    txtArray.pop();
                }
            })

            //Compare the updated length of array and the stored array
            
            
            //Update the stored array content
            slide_bar.appendChild(startBtn)
            slide_bar.appendChild(endBtn)
            localStorage.setItem(`${filterLi}`, JSON.stringify(txtArray))
            if(localStorage.getItem(`${filterLi}`)) {
                check.classList.toggle("active")
                startBtn.addEventListener('click', function() {
                    currentIndex = 0;
                    trueAnswer = 0;
                    falseAnswer = 0
                    missedAnswer = 0
                    // Capture the start time
                    startTime = Date.now();
                    console.log(`Quiz started at: ${new Date(startTime).toLocaleTimeString()}`);

                    container.classList.add('start-qz')
                    if(container.classList.contains('start-qz')) {
                        Array.from(lis).filter(l => l.classList.contains('active')).map(l => quesLink(`https://raw.githubusercontent.com/drmostafa710/${l.textContent}/main/${l.textContent}.json`))
                        startBtn.disabled = true;
                    }
                    // quesLink(`https://raw.githubusercontent.com/drmostafa710/${l.textContent}/main/${l.textContent}.json`)
                })

                endBtn.addEventListener('click', function() {
                    clearInterval(set_interval)
                    container.classList.remove('start-qz')
                    container.innerHTML = ''
                    startBtn.disabled = false;

                    let answers = document.querySelectorAll('.answer')
                    answers.forEach(function(a) {
                        a.classList.add('finished-ques')
                    })
                })
                
                Array.from(lis).filter(l => l.classList.contains('active')).map(l => {
                    l.addEventListener('click', function() {
                        startBtn.remove()
                        endBtn.remove()
                    })
                })
        } else {
            check.classList.toggle("active")
            }
        } else {
            if(txt.value === 'rx' || txt.value === 'Rx' && localStorage.getItem(`${filterLi}`)) {
                // txtArray.pop();
                showRanking();
        }
        }
        txt.value = ''
    })

    //Push the rank and time elapsed in array 
}

//put the ranking and the time elapsed
function putElapsedTme(elapsed, li, txtArray, number_trueAnswers, objLength) {
    txtArray.forEach(ele => {
        if(!ele["elapsed"] && !ele["true-answers"]) {
            //Get the latest UsName of the array
            let lastAddedUsName = txtArray[txtArray.length - 1]
            //Get the latest elapsed tm
            let secondsTm = Math.round(elapsed / 1000)
            
            //Add the elapsed tm to usName
            lastAddedUsName['elapsed'] = secondsTm + ' seconds'; 
            
            //Add the true answers for the user
            if(number_trueAnswers === '') {
                lastAddedUsName['true-answers'] = 0 + ' / ' + objLength; 
            } else {
                lastAddedUsName['true-answers'] = number_trueAnswers + ' / ' + objLength; 
            }

            //update the storage of the array
            localStorage.setItem(`${li.textContent}`, JSON.stringify(txtArray))
        }
    })
}

//leader access on the user outPuts (usName, true-answers, elapsed tm) 
function showRanking() {
    let table = document.createElement('table')
    table.className = 'student-infos' 
    
    let tHead = document.createElement('thead')
    tHead.innerHTML = `
        <tr>
            <th>Student Name</th>
            <th>Time Elapsed</th>
            <th>Evaluation</th>
        </tr>
    `
    table.appendChild(tHead)
    
    let tBody = document.createElement('tbody')

    let filterLi = Array.from(lis)
    .filter(l => l.classList.contains('active'))
    .map(l => l.textContent).join("")

    //Very UseFul thing i learn it
    txtArray.sort((a, b) => {
        if(parseInt(a['true-answers']) !== parseInt(b['true-answers'])) {
            return parseInt(b['true-answers']) - parseInt(a['true-answers'])
        } 
        else if(parseInt(a['true-answers']) === parseInt(b['true-answers']) ) {
            if(parseInt(a['elapsed']) < parseInt(b['elapsed'])) {
                return parseInt(a['elapsed']) - parseInt(b['elapsed'])
            }
        }
    })

    //store the updated sorted array
    localStorage.setItem(`${filterLi}`, JSON.stringify(txtArray));
    
    //Show the user the submit the quiz only
    let present_elapsedInfo = txtArray.filter(e => {
        return e['elapsed'] 
    })

    console.log(present_elapsedInfo)

    for (let j = 0; j < present_elapsedInfo.length; j++) {
        let tr = document.createElement('tr')
        tr.innerHTML = `
            <td></td>
            <td></td>
            <td> </td>
        `;

        [...tr.children].forEach(function(td, t) {
            Object.values(present_elapsedInfo[j]).forEach(function(value, v){
                if(v === t) {
                    td.textContent = value  
                }
            })
        })
        tBody.appendChild(tr)
    }
    table.appendChild(tBody)
    
    document.body.appendChild(table)
}

/*
Sort Array According I Want
    // let array = [
    // {
    //     elapsed: '10 seconds',
    //     true: '1 / 10',
    // }, {
    //     elapsed: '7 seconds',
    //     true: '2 / 10',
    // }, {
    //     elapsed: '9 seconds' ,//b
    //     true: '3 / 10',
    // }
    // , {
    //     elapsed: '6 seconds', //a
    //     true: '3 / 10',
    // }
    // , {
    //     elapsed: '6 seconds' ,//a
    //     true: '4 / 10',
    // }
    // , {
    //     elapsed: '2 seconds', //a
    //     true: '2 / 10',
    // }
    // , {
    //     elapsed: '1 seconds' ,//a
    //     true: '1 / 10',
    // }
    // , {
    //     elapsed: '7 seconds', //a
    //     true: '4 / 10'
    // }
    // ]
    // array.sort((a, b) => {
    //     if(parseInt(a['true']) !== parseInt(b['true'])) {
    //         return parseInt(b['true']) - parseInt(a['true'])
    //     } 
    //     else if(parseInt(a['true']) === parseInt(b['true']) ) {
    //         if(parseInt(a['elapsed']) < parseInt(b['elapsed'])) {
    //             return parseInt(a['elapsed']) - parseInt(b['elapsed'])
    //         }
    //     }
    // })

    // console.log(array)
*/