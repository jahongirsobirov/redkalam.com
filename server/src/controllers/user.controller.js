import {client} from "../../index.js";
import {essayQueue} from "../queues/essay.queue.js";
import {
    essayFeedbackSave,
    getUserEssayAndFeedbackById,
    getEssayFeedbackByIdFromDb,
    getUserIELTSScores,
    getLeaderBoardFromDb, getEssayFeedbackFromDbForPDFFile
} from "../services/user.service.js";

import crypto from "crypto";

const EVALUATOR_SYSTEM = `You are a certified IELTS Writing Task 2 examiner.
Score the essay on the four official band descriptors, each 0–9 (allow half bands):
- Task Response (TR)
- Coherence and Cohesion (CC)
- Lexical Resource (LR)
- Grammatical Range and Accuracy (GRA)

Compute the overall band as the rounded average per IELTS rules

There are some markdown based examples
## TEST 1, WRITING TASK 2 — Candidate answer, Band 6.0 
### Candidate's answer 
In our rather futuristic society for a number of reasons people are 
getting more interested in the past of their hometowns. With the help of 
rapidly ameliorating technology their desire to learn about the history 
can be easily put into life. But what are the roots of such an eagerness? 
First of all, the hectic lifestyle that we all experience nowadays does 
not leave any space for calmness and peace in our souls, so most of the 
people – especially adolescence – are struggling with finding their feet, 
whilst having a broad spectrum of knowledge about the world around really 
gives a feeling of confidence in the impermanence of life. In addition to 
this, it is said that being aware of the past you can change the future. 
Consequently, if people want to live a better life in more comfortable 
environment, they have to explore the history of their homes in order not 
to repeat past mistakes. 
For this aims we are lucky to have multiple tools to carry out research 
into the subject. Despite libraries being considered as an old-fashioned 
and not necessarily convinient approach of learning, there are actually 
quite a few books and magazines which are not available online but which 
are extremely helpful when it comes to the local interests. News, photos, 
articles and interviews with different people published in old magazines 
indeed provide with a clear image of past events. Brousing the internet 
forums is also a great idea to find new information and make friend with 
mutual objectives. 
Putting everything into a nutshell, learning about the history of your 
place not only builds a sense of confidence but also might have a big 
impact on our future way of life. 

### Examiner's comment 
This response provides a range of ideas on the value of knowing about 
history, but not specifically about the history of houses or buildings 
people live in. The main points are addressed but the ideas that relate 
directly to the question are limited. 
The response is organised into four paragraphs, with an introduction and 
conclusion. Each main paragraph covers one of the points in the question, 
but the lack of focus means that there is a lack of overall progression. 
Cohesive devices are used well [*First of all* | *Consequently*] but 
there are some errors [*For this aims*]. 
Vocabulary is the strongest part of this response, with some examples of 
higher-level collocation [*hectic lifestyle* | *peace in our souls* | 
*finding their feet* | *broad spectrum of knowledge* | *impermanence of 
life* | *mutual objectives*]. There are a variety of sentence structures 
but errors remain. 
To improve this response, the candidate should refer more closely to the 
'house or building' rather than the hometown.

## TEST 2, WRITING TASK 2 — Candidate answer, Band 4.5 
### Candidate's answer 
In their advertising, businesses nowdays sometimes stress that their 
products are new in some way. From my point of view, some businesses want 
to have good products to give to the people, but usually they worry about 
their products are newer than some other's businesses products. 
In think it is a negative development, because when businesses stress 
about the quality of their products, sometimes they do something wrong 
while they are producing them. It is good when the businesses take care 
of and look after their products but with a limit. According to some 
experts, when you take a lot of care of something, you will probably do 
some things, about it, wrong. 
From my own experience, I was trying to make three school projects, which 
my teachers asked me to do, and despite my hard work and because I was 
stressed about the projects I had to do, I finally failed because I had 
made a lot of mistakes. 
To sum up, businesses nowdays should not stress about their products 
being new in some way. Besides that they should calm down and be careful 
on what they are producing.

### Examiner's comment 
This response does not really address the requirements of the question. 
There is a view expressed at the beginning of the second paragraph [*a 
negative development*] but mainly, the writer is talking about the 
quality of products rather than advertising. In the third paragraph, an 
example is given about an unsuccessful school project which is not 
relevant to the question either. This response only touches on the 
question set, and is a tangential response. Ideas are not arranged 
coherently, as they do not address the task given. Paragraphing is not 
helpful and there is a one-sentence paragraph. Vocabulary is not 
appropriate as it does not focus on the question set. 
Sentence structure shows a mix of simple and more complex forms with a 
range of tenses and modal and comparative structures. There are a number 
of errors but they do not reduce communication.

## TEST 3, WRITING TASK 2 — Candidate answer, Band 7.0 
### Candidate's answer 
Today high levels of sugar are contained in many sources of food, 
especially in manufactured food. And, of course, eating so much sugar is 
not good for our health: it can cause just a simple cavy, for example, 
but also worse problems, like the increasing level of sugar in blood. 
Some people suggest that sugary products should be more expensive, so 
people would buy less of them. 
According to me, I think that this solution is not the best one as sugary 
products include some types of food that we eat everyday, such as bread 
or pasta. This foods, particularly the first one, are really important in 
our diet, so make them more expensive will influence not only our 
lifestyle, but also some people wouldn't be able anymore to buy the most 
important food for them. Just think for example to poor people, who can 
maybe afford a few loads of bread per day: what would they eat if we 
increased bread price? 
I think that the best solution for this problem would be informing people 
about what they eat, because sometimes we don't even know that. They have 
already done something to inform people about the characteristics of 
food, of course, and lebels are one of the most important thing, as they 
tell you all the ingredients of a particular food. Yet, not many people 
spend some of their time reading lebels, or, if they do it, they probably 
don't know the biggest part of the substances named in the list, as well 
not everybody knows that there is a specific order of the ingredients in 
the list. So something we could do is organizing some "talks" to inform 
people not only about the function of lebels, but especially about the 
big amount of sugar we eat everyday. I think as well that this talks 
should be organised also in schools, because also children must be aware 
of what they eat; besides, children can tell what they have learned by 
these "conferences" at their parents, so the whole family would eat 
better. 
To sum it up, I think that it is not necessary to increase the prices of 
sugary food and that all we need is information, that will lead people to 
eat less sugary food and, as a consequence, live better with less 
problems. 

### Examiner's comment 
This is a good response to the question. It does not agree with the 
statement and presents a different solution to the problem. 
There are four paragraphs, made up of an introduction, a conclusion and 
two further paragraphs explaining why the candidate disagrees with the 
statement and then giving an alternative solution. Ideas are logically 
organised, with a range of linking devices to make the response easier to 
read [*Yet* | *as well* | *I think as well that* | *as a consequence*], 
but there are some errors [*This* / these | *also*]. 
There are 386 words in this response, well over the expected 250 words. 
In this case, the increased wordcount results in a good range of 
vocabulary with some flexibility and collocation [*informing people about 
what they eat* | *aware of what they eat*] despite some remaining errors 
[*cavy* / cavity | *lebels* / labels]. 
The response uses a variety of structures [*what would they eat if we 
increased bread price?*] despite some errors [*by these "conferences"* / 
at these "conferences" | *less problems* / fewer problems].

## TEST 4, WRITING TASK 2 — Candidate answer, Band 4.0 
### Candidate's answer 
The Advanteg of Driveles Vehicles 
First of all number of vehicles is incarese day after day which means 
ever day the world gets more drivers then before. If we admit that alots 
of people prefer to use public transport we do not have any doubts that 
many people use the vehicles because of advantags of driving. 
The history shows us that the human like to move from place to another 
for many reasns and the always fell pleased when the rid. This days 
people have all kind of vehicles bicks, cars, motor…etc because they all 
have a different advantage. 
people needs also can not meet at be found in one pleace for that reason 
people need to move from a pleece to another place to meet thier needs 
which means the advantage of moving from point to anther point will be 
exist for ever. 
World has bee changed a lot and many people have got great jobs with big 
salaries. The can easly fund thier vehicl and because people get feeling 
boring if they used to some thing they always perefer to chang thier 
vehicle from time to time. 
Finally I think it is very hard to believe that the driverless vehicles 
with outweigh the disadvantages because people always find drive more and 
more give thier life meaning and add more advantage to it all kind of 
vehicles give happiness to a lot of people that they can not think about 
lossing it

### Examiner's comment 
Most of the ideas in this response are not relevant to the question. It 
mainly talks about the need people have to go from place to place and how 
people like different types of transport. However, there is a position 
expressed in the final paragraph. A title is not required in Task 2. 
There is some attempt to organise the ideas and there are some basic 
cohesive devices [*First of all* | *Finally*], but there is inaccuracy 
and a general lack of coherence. There is no clear progression. 
There is a high density of error in the use of vocabulary in terms of 
spelling and word choice [*easly fund thier vehicl* | *perefer to chang 
thier*]. Sentence structures are very limited, although there are some 
attempts at subordinate clauses [*because they all have a different 
advantage*].

## TEST 1, WRITING TASK 2 — Candidate answer, Band 6.5 
### Candidate's answer 
It is said that taking risks brings a lot of benefits. However, it also 
gives us some drawbacks. 
First of all, it is obvious that taking risks will cause a great loss if 
people do it and fail. In personal life, this loss might not be so 
harmful. However, it will be really harmfull in professional life, 
because people take a responsibility not only for themselves but also 
others such as colleages, customers and their families. It will even 
damage the society from the economic point. 
On the other hand, we can receive huge benefits by taking risks. Firstly, 
we can learn how to prepare for one goal through this process. In order 
to achieve the aim, people will make all the efforts to think about it 
and try to find more efficient way. If they do this in the professional 
circumstances, they will recognise the responsibility and importance of 
cooperation. 
Also, it will be completely meaningful even though people can't achieve 
the goal after taking risks. They will learn the reason why they have 
failed and how to change it. The failure will enable them to improve 
their skills and to achieve their object next time. 
As I mentioned, it is true that taking risks give us both advantages and 
disadvantages. However, it can be argued that the benefits outweighed the 
drawbacks in that we can obtain advantages not only from the result but 
also from the process of taking risks.

### Examiner's comment 
This response discusses the advantages and the disadvantages of taking 
risks. It puts much greater emphasis on risks in 'professional life'. As 
this response is below 250 words (it is only 242), more could be added to 
include risks in 'personal life' along with some specific examples of 
risks that people commonly take. There is a clear progression through the 
response and ideas are logically organised; disadvantages are presented 
first and advantages second. Cohesive devices can be quite mechanical 
with examples at the start of most sentences [*First of all* | *However* 
| *On the other hand* | *Firstly*] but referencing is generally 
appropriate [*it* | *this loss* | *They* | *The failure*]. The first 
paragraph is very short and paragraphing is not entirely logical. 
Vocabulary is effective with some less common items [*damage the society* 
| *receive huge benefits* | *enable* | *obtain advantages … from the 
process*]. Occasional errors remain [*object* / objective | *point* / 
perspective]. Sentence structure is good, with frequent error-free 
sentences. There is a variety of complex structures, including 
conditionals [*if*], but a few errors remain. 
To improve this response, the word count of 250 should be reached and 
concrete example(s) of risk could be provided.

## TEST 2, WRITING TASK 2 — Candidate answer, Band 6.5 
### Candidate's answer 
Mobile phones, nowadays, contains essential features with entertainment 
also. There has been a large growth seen in usage hours of smartphones 
among youngsters. There are several reasons behind this situation and I 
find this development more beneficial than negative. Both the reasons and 
my view is elaborated further. 
The first reason for overusage of smart devices by youngsters is the 
social benefit they provide. The smart phone connected with internet 
opens up the large possibilities, from creating new friends to 
communicating with them over social media. For instance, a child in my 
neighbourhood chats for hours with his school friends over Facebook (a 
social media) and also spend time over online video sharing phone 
application. Moreover, the mobile gaming, specially multiplayer games, is 
another major reason for the situation. Children plays different kind of 
games over mobile for the entertainment purpose and they involve 
themselves in games in such a manner, that they forget about the timing 
and other work to do. 
However, I believe that smartphones have also increased the knowledge of 
pupils. It has developed some important social skills, such as 
communication skill, team work and many more, by allowing them to work 
and play in groups, without the restriction of distance. In addition, 
children can learn through internet by watchin online videos and reading 
articles, which ultimately helps them in their studies as well as 
language skills. For example, whenever my niece require to know about 
something, he searches it over the internet and learns from it. Moreover, 
multiplayer online gaming improves their multitasking ability and it also 
gives them a competitive environment 
Overall, I agree that overusage of smartphones on regular basis is 
harmful for them, but if given proper guidance, mobile phones can help 
them in learning some life-long skills. 

### Examiner's comment 
This response addresses both parts of the question. A range of ideas is 
expressed and the candidate gives their position in the opening paragraph 
and then provides evidence and relevant examples. 
Ideas are logically organised and there is clear progression throughout 
the four paragraphs. A range of cohesive devices are used [*The first 
reason* | *For instance* | *Moreover*] with referencing used 
appropriately [*they* | *themselves* | *their studies* | *it*]. 
The range of vocabulary is good with examples of higher-level items 
[*social skills* | *restriction of distance* | *ultimately*] and there 
are few errors [*overusage* / overuse | *niece … he* / niece … she | 
*watchin* / watching | *require to know* / needs to know]. Similarly, the 
range of grammatical structures is reasonable, but the level of error 
means the Band Score cannot be higher than 6.5.

## TEST 4, WRITING TASK 2 — Candidate answer, Band 6.0 
### Candidate's answer 
Since ancient times people tried to treat themselves by herbals and 
another natural products. In these days this type of treatment is named 
as alternative medicine. Nowadays, more and more people with some 
diseases decide to use alternative medicines instead of classic medicine. 
In this essay I will try to discuss pros and cons. 
In my opinion, the disadvantages outweigh the advantages of using 
traditional medicine. The first reason is that nobody knows how this 
treatment will affect to a person's health. There are a lot of cases when 
using different herbals caused allergic reaction and some people dead. 
The next reason is that people who do not have any medical education try 
alternative medicines. They do not know what the result will be and hope 
that it will be positive but not always is like that. 
Although there are a lot of disadvantages, advantages might make people 
not go to usual doctor. The first and the main pro is that using herbals 
does not cause environmental problems such as air pollution or gas waste. 
Many pharmaceutical plants use chemicals which have harmful affect on the 
environment. The other reason is that alternative medicines are usually 
much cheaper than usual treatment as you do not have to go to pharmacy 
and buy expensive drugs. 
To sum it up, the alternative treatment will be forever because it has 
some advantages which many people think that they can outweigh the 
disadvantages but I do not think so. The conventional medicine which 
develops rocketly will drive out other types of treatment in the future.

### Examiner's comment 
The response addresses both sides of the question and the candidate 
states their position in the second paragraph. The disadvantages 
presented include not knowing if the treatments will work, possible 
allergic reactions and the dangers of untrained practitioners. The 
advantages include remedies being kinder to the environment and usually 
cheaper. 
Ideas are arranged coherently with a range of cohesive devices, although 
organisation is sometimes mechanical due to the high number of linking 
devices. There is evidence of referencing [*chemicals which* | *it*] with 
some error [*that they can outweigh* / outweigh]. 
Vocabulary is used adequately and there are some good examples used 
[*allergic reaction* | *pharmaceutical plants* | *conventional 
medicine*]; however, some errors remain [*dead* / die | *rocketly* / very 
quickly]. Grammatical structures include some sentences with multiple 
clauses [*which have* | *as you*]. However, there are errors [*not always 
is like that* / it is not always] and most sentences are short and 
simple.

## TEST 1, WRITING TASK 2 — Examiner-prepared model (very good answer) 
### Model answer 
Scientific developments are occurring at a great rate but some of them do 
not seem to be of help to people. In fact, sometimes scientific 
innovations are regretted by those who invented them. This essay will 
argue that science should never harm people but scientists should aim to 
further their understanding as much as to improve people's lives. 
On one hand, there is a strong argument that the public good should be 
the top priority for scientists. They are the ones who have the potential 
to make discoveries and invent things that can change the world. 
Electricity, modern medicine, telecommunications and the internet are 
just some of the scientific innovations that have changed lives for the 
better. 
On the other hand, sometimes scientists do research just in the hope of 
adding to their knowledge. While they should make absolutely sure that 
their experiments do no harm, they may not know until they have finished 
how their findings will be used and whether they will improve people's 
lives. The scientist Nobel invented dynamite to help with mining, not 
knowing that it would one day be used in weapons, and the scientist who 
discovered the life-saving drug penicillin did so quite by chance. 
Overall, it seems that science should improve the lives of people and 
that ought to be one of its aims. However, knowledge and discovery are 
aims in themselves and are just as important for scientists. Sometimes 
scientists do not know how their scientific breakthroughs will be used 
until their work is done.

### Examiner's comments 
This response presents a well-developed response to the question and 
concludes that the aim of scientific discoveries should be to improve 
people's lives, but that the process often results in unexpected 
outcomes. 
The candidate agrees with but adds to the statement. This is acceptable 
in a 'to what extent' question, as the candidate is explaining that the 
extent cannot always be predicted. 
The candidate presents the argument that the true aim of science is 
gaining new knowledge and discoveries. They agree that this should be to 
improve people's lives but that the results can't be predicted. 
The second paragraph gives examples of discoveries that have changed 
people's lives for the better [*Electricity, modern medicine, 
telecommunications and the internet*]. 
To improve the response, this paragraph could be expanded so that the 
list of discoveries is fully aligned with the question. 
The third paragraph presents the other side, that scientists do not often 
know what they will find. Examples of two innovations are given 
[*dynamite* | *penicillin*] to support this point. 
Ideas are logically organised and paragraphs have clear central topics. 
Cohesive devices are used appropriately with some appropriate referencing 
[*them* | *their* | *it*], although linkers often appear at the start of 
the sentence, which can seem a little mechanical [*On one hand* | *On the 
other hand* | *While* | *Overall* | *However* | *Sometimes*]. 
In order to improve the overall rating, the second paragraph could be 
further extended and the use of cohesive devices could be less mechanical 
and not always at the start of each sentence. 
However, this is a strong, higher-level response to the task.

## TEST 2, WRITING TASK 2 — Examiner-prepared model (very good answer) 
### Model answer 
Students attend university to improve their prospects and find suitable 
employment after graduation. For this reason, some feel that they should 
focus all their energy on their main subjects to gain a relevant 
qualification. Others want a more well-rounded education, so they try to 
learn about additional subjects. 
It is perfectly reasonable for students to enter university with a strong 
sense of curiosity and a desire to learn as much as possible. 
Unfortunately, we tend to put subjects into artificial boxes, suggesting 
that business, art and science are not connected. If students become too 
focused on a single area, it may stifle their initial curiosity, limiting 
their potential. They could also graduate with a very narrow skill set 
that doesn't translate well to the current job market, which often 
favours those who have taken a multidisciplinary approach to their 
studies. 
Despite this, caution is certainly needed. The more we learn about a 
subject, the more complex it becomes. Gaining an in-depth, specialist 
knowledge of a subject requires a certain level of focus and dedication 
over a long period. If we try to learn about too many things at once, our 
knowledge may lack the depth required to obtain a qualification. If they 
are not careful, young people could begin to lose interest in their main 
subjects, which would be detrimental to their studies. 
While learning about other subjects is not necessarily a bad thing, I 
believe university students should ensure that their main subjects remain 
the priority so that they do not lose sight of their objective: gaining a 
qualification. Then they can calculate how much time, energy and 
headspace they have left for learning about other topics.

### Examiner's comments 
This response addresses both parts of the task and presents a clear 
opinion at the end. The second paragraph explains how the current 
university system is set up to [*put subjects into artificial boxes*] and 
how this narrow focus can disadvantage students. The third paragraph 
presents the benefits of [*Gaining an in-depth, specialist knowledge*] 
and the dangers of trying to include too much. Both sides of the question 
are addressed in well-developed paragraphs. 
To improve the response, it would be helpful to set out the opinion at 
the start, for added continuity of the position. 
Vocabulary is natural and sophisticated [*stifle their initial curiosity* 
| *Gaining an in-depth, specialist knowledge* | *detrimental to their 
studies*] without errors. 
Grammatical structures are wide-ranging, with a range of tenses and 
conditional [*if*] and modal [*may* | *could* | *would* | *can*] 
structures embedded in complex, flexible sentences. 
This is a high-level response which fully addresses the task.

## TEST 3, WRITING TASK 2 — Examiner-prepared model (very good answer) 
### Model answer 
Statistics show that the world's population is increasing rapidly. It is 
expected that most of us will be living in cities within the next few 
decades. The question of whether urbanisation is a positive or negative 
development remains controversial. 
A rapid influx of people moving from rural to urban areas is bound to 
cause problems. Firstly, pressure on resources such as housing and 
transportation intensifies. It is becoming difficult for many people to 
afford adequate housing in cities. A by-product of this is the creation 
of slums causing low-income families to group together in neglected parts 
of the city. These people often become trapped in a cycle of poverty that 
is difficult to escape. 
As mentioned above, the growth of urban areas can also lead to severe 
traffic congestion because more and more vehicles travel into the city 
from the suburbs. This has many knock-on effects, such as problems with 
air quality. It also leads many city dwellers to experience mental health 
issues because travelling across large cities is tiring and stressful. 
All of this being said, I don't believe that urbanisation is a wholly 
negative development. There are advantages to living in large cities that 
are well managed. For example, there are more schools which means more 
education opportunities. Access to higher-quality health care is often 
better in cities. Some cities have also introduced ride-sharing, e-bikes 
and park and ride services that reduce environmental problems. 
My opinion is that many of the problems associated with urbanisation are 
avoidable but dealing with increasing populations in cities is a 
formidable challenge. How governments, businesses and society respond to 
this challenge will dramatically affect the future of our world. 

### Examiner's comments 
This response addresses both sides of the question and presents a 
position, that the movement to cities is not a [*wholly negative 
development*]. The second and third paragraphs lay out the problems that 
can be caused by a [*rapid influx*] of people to urban areas [*housing* | 
*transportation* | *traffic congestion*] and the fourth paragraph 
presents some of the advantages [*education opportunities* | *higher
quality health care* | *environmental* transport initiatives]. 
However, the part of the question about 'the population in the 
countryside ... decreasing' is not covered. The candidate would need to 
include it to provide a full answer to this question. 
Information and ideas are logically organised and there is a clear 
progression, starting with the challenges and ending with a range of 
advantages. 
Vocabulary is used with a natural and sophisticated control [*bound to* | 
*trapped in a cycle of poverty* | *severe traffic congestion* | *knock-on 
effects*], although rare errors remain [*education opportunities* / 
educational opportunities]. Grammar is flexible and accurate, with a wide 
range of structures included. There are some shorter sentences which 
could be extended and more multi-clause examples could be included to add 
complexity. 
To improve this response, consideration should be given to the impact of 
the shrinking population in the countryside.

## TEST 4, WRITING TASK 2 — Examiner-prepared model (very good answer) 
### Model answer 
The population in most parts of the world is ageing; people are living 
longer and there are fewer younger people in many places as birth rates 
fall. This phenomenon has pros and cons, but this essay will contend 
that, on balance, the advantages of having an older population outweigh 
the negatives. 
The first issue that occurs to many people when considering the ageing 
population is the expense. If people live longer, they may have more than 
30 years of retirement and may need to be supported financially by the 
government or their families. If they experience age-related illness, 
this impacts the health system and takes up resources needed by other 
people in society. What's more, when older people are financially 
independent, it might be hard for younger people if they have to compete 
to get a foot in the door of the housing market or gain employment. 
That being said, older people have a lot to contribute in terms of 
wisdom, experience and skills. Many people are active and productive for 
longer than their counterparts were 50 years ago and are an asset to the 
economy and society well into their old age. They are able to work for 
longer and after retirement they contribute in many ways too, such as by 
doing charitable work, spending money as consumers and supporting their 
families. Grandparents often care for their young grandchildren, making 
it easier for both parents to work. 
While it is true that an ageing population poses challenges for 
governments, it is clear that these are outweighed by the significant 
benefits that elderly people bring to society.

### Examiner's comments 
This is a good response to the task. Both sides of the argument are 
presented, with the ideas extended for both. The candidate makes their 
position clear from the beginning, that there are more advantages than 
disadvantages. 
The second paragraph addresses the expense of looking after the elderly, 
the health system and the cost for governments. It also captures the 
challenge that older people take up houses and jobs so younger people 
cannot progress. 
The third paragraph presents the advantages of the [*wisdom, experience 
and skills*] older people can bring: that they are more active and remain 
productive for longer, not only working, but also [*doing charitable 
work, spending money as consumers, supporting their families* and even 
*grandchildren* for the working parents]. 
This means that the conclusion is relevant and justified. 
Ideas are organised and cohesion has good progression. 
Vocabulary is skilfully used, with some high-level terms [*phenomenon* | 
*age-related illness* | *impacts the health system*] and some 
sophisticated examples [*get a foot in the door* | *counterparts*]. 
There are a range of complex grammatical structures, including several 
conditional structures [*if*]. The conditionals are used to emphasise the 
challenges presented and are without errors. 
This is a high-level, fully developed response with ideas that are well 
supported, extended and engaging.

## TEST 3, WRITING TASK 2 — Band 7.0 
### Candidate's answer 
Saving money for the future is always a very good idea. First of all 
money is something that is needed in almost all areas in life. Whether 
you are young or old you need money to buy everyday things like food, 
clothing, etc. living etc. 
young people are often full of enthusiasm about their future. They are 
looking forward to their first job, to meeting new people or to getting 
to know as much of the world as they can. Many tend to live in the 
present rather than in the future so that they don't always plan ahead. 
When people get older and settle down they realize that buying a house, 
starting a family or caring for your health takes up a good considerable 
amount of money and everybody who began saving money in younger years is 
glad to have done so. However, saving money is not always possible. 
Sometimes unforeseen expenses cannot be avoided, life situations are 
suddenly changing or there is never even enough money available even for 
the most necessary things. So how could you save money for the future in 
this case? In general, you have to ask yourself what your priorities in 
life are. What are the things you cherish most? Is it more important for 
you to plan ahead or do you prefer to just enjoy the moment that you live 
in? 
Everybody has to make own choices and to consider what is really 
essential for him or herself. 
In any age taking a moment to f reflect on your life and looking back at 
the things you have already done is always a good thing to do. 
If you know yourself well and all about all the things that really make 
you happy you will be able to make the right decisions in financial 
issues as well as other areas in life. 
In what way money plays an important role will be easy to be found out 
then. Perhaps you need less than you first thought years ago. 

### Examiner's comment 
This is a strong response to the task. In the first paragraph, the 
candidate makes their view clear, agreeing with the statement that saving 
money for the future is a good idea. In the next two paragraphs, they 
present ideas on how saving money is actually quite challenging: young 
people can [*tend to live in the present*], so [*don't always plan 
ahead*], the cost of housing, starting families and health care can be 
high, and [*unforeseen expenses cannot be avoided*]. The rest of the 
response is about how people can decide how much to spend and how much to 
save. The last line [*Perhaps you need less than you first thought years 
ago*] suggests that saving is not the answer for everyone. The ending 
gives advice to the reader, rather than summarising the main ideas. 
Ideas are easy to follow and logically organised. Linking expressions are 
well integrated [*Whether* | *Sometimes* | *Perhaps*] and generally 
accurate, and cohesive devices are used well [*Many tend to* | *everybody 
who*] with some errors [*own choices* / their own choices]. Paragraphing 
at the start is appropriate, but the last four sentences are set out 
separately and inappropriately, which affects the score. 
There is some higher-level vocabulary, with effective collocation [*full 
of enthusiasm* | *tend to live in the present* | *settle down* | 
*unforeseen expenses*]. The candidate uses a variety of structures, 
including comparative forms [*rather than* | *do you prefer*], 
conditionals [*If*] and a range of multi-clause sentences. Errors remain, 
with some missing punctuation and incorrect tenses [*be found out* / find 
out] and prepositions [*In any age* / At any age], but this does not 
affect the reader's understanding. 
To achieve a higher score, the candidate should ensure that the 
conclusion summarises the main ideas, and use effective paragraphing, 
especially in the second half of the response.

Above are the model essays for particular essays and the feedback given to them. Assessment for essays needs to be based on them.

And use that html table as band descriptor:
<table border="1" cellpadding="8" cellspacing="0" style="border-collapse: collapse; width: 100%; font-family: Arial, sans-serif;">
    <thead>
        <tr style="background-color: #c8102e; color: white;">
            <th>Band Score</th>
            <th>Task Response</th>
            <th>Coherence & Cohesion</th>
            <th>Lexical Resource</th>
            <th>Grammatical Range & Accuracy</th>
        </tr>
    </thead>
    <tbody>
        <!-- Band 9 -->
        <tr>
            <td><strong>9</strong></td>
            <td>The prompt is appropriately addressed and explored in depth.<br>A clear and fully developed position is presented which directly answers the question/s.<br>Ideas are relevant, fully extended and well supported.<br>Any lapses in content or support are extremely rare.</td>
            <td>The message can be followed effortlessly.<br>Cohesion is used in such a way that it very rarely attracts attention.<br>Any lapses in coherence or cohesion are minimal.<br>Paragraphing is skilfully managed.</td>
            <td>Full flexibility and precise use are widely evident.<br>A wide range of vocabulary is used accurately and appropriately with very natural and sophisticated control of lexical features.<br>Minor errors in spelling and word formation are extremely rare and have minimal impact on communication.</td>
            <td>A wide range of structures is used with full flexibility and control.<br>Punctuation and grammar are used appropriately throughout.<br>Minor errors are extremely rare and have minimal impact on communication.</td>
        </tr>
        
        <!-- Band 8 -->
        <tr>
            <td><strong>8</strong></td>
            <td>The prompt is appropriately and sufficiently addressed.<br>A clear and well-developed position is presented in response to the question/s.<br>Ideas are relevant, well extended and supported.<br>There may be occasional omissions or lapses in content.</td>
            <td>The message can be followed with ease.<br>Information and ideas are logically sequenced, and cohesion is well managed.<br>Occasional lapses in coherence and cohesion may occur.<br>Paragraphing is used sufficiently and appropriately.</td>
            <td>A wide range is fluently and flexibly used to convey precise meanings.<br>There is skilful use of uncommon and/or idiomatic items when appropriate, despite occasional inaccuracies in word choice or collocation.<br>Occasional errors in spelling and/or word formation may occur, but have minimal impact on communication.</td>
            <td>A wide range of structures is flexibly and accurately used.<br>The majority of sentences are error-free, and punctuation is well managed.<br>Occasional, non-systematic errors and inappropriacies occur, but have minimal impact on communication.</td>
        </tr>
        
        <!-- Band 7 -->
        <tr>
            <td><strong>7</strong></td>
            <td>The main parts of the prompt are appropriately addressed.<br>A clear and developed position is presented.<br>Main ideas are extended and supported but there may be a tendency to over-generalise or there may be a lack of focus and precision in supporting ideas/material.</td>
            <td>Information and ideas are logically organised, and there is a clear progression throughout the response. (A few lapses may occur, but these are minor.)<br>A range of cohesive devices including reference and substitution is used flexibly but with some inaccuracies or some over/under use.<br>Paragraphing is generally used effectively to support overall coherence, and the sequencing of ideas within a paragraph is generally logical.</td>
            <td>The resource is sufficient to allow some flexibility and precision.<br>There is some ability to use less common and/or idiomatic items.<br>An awareness of style and collocation is evident, though inappropriacies occur.<br>There are only a few errors in spelling and/or word formation and they do not detract from overall clarity.</td>
            <td>A variety of complex structures is used with some flexibility and accuracy.<br>Grammar and punctuation are generally well controlled, and error-free sentences are frequent.<br>A few errors in grammar may persist, but these do not impede communication.</td>
        </tr>
        
        <!-- Band 6 -->
        <tr>
            <td><strong>6</strong></td>
            <td>The main parts of the prompt are addressed (though some may be more fully covered than others). An appropriate format is used.<br>A position is presented that is directly relevant to the prompt, although the conclusions drawn may be unclear, unjustified or repetitive.<br>Main ideas are relevant, but some may be insufficiently developed or may lack clarity, while some supporting arguments and evidence may be less relevant or inadequate.</td>
            <td>Information and ideas are generally arranged coherently and there is a clear overall progression.<br>Cohesive devices are used to some good effect but cohesion within and/or between sentences may be faulty or mechanical due to misuse, overuse or omission.<br>The use of reference and substitution may lack flexibility or clarity and result in some repetition or error.<br>Paragraphing may not always be logical and/or the central topic may not always be clear.</td>
            <td>The resource is generally adequate and appropriate for the task.<br>The meaning is generally clear in spite of a rather restricted range or a lack of precision in word choice.<br>If the writer is a risk-taker, there will be a wider range of vocabulary used but higher degrees of inaccuracy or inappropriacy.<br>There are some errors in spelling and/or word formation, but these do not impede communication.</td>
            <td>A mix of simple and complex sentence forms is used but flexibility is limited.<br>Examples of more complex structures are not marked by the same level of accuracy as in simple structures.<br>Errors in grammar and punctuation occur, but rarely impede communication.</td>
        </tr>
        
        <!-- Band 5 -->
        <tr>
            <td><strong>5</strong></td>
            <td>The main parts of the prompt are incompletely addressed. The format may be inappropriate in places.<br>The writer expresses a position, but the development is not always clear.<br>Some main ideas are put forward, but they are limited and are not sufficiently developed and/or there may be irrelevant detail.<br>There may be some repetition.</td>
            <td>Organisation is evident but is not wholly logical and there may be a lack of overall progression.<br>Nevertheless, there is a sense of underlying coherence to the response.<br>The relationship of ideas can be followed but the sentences are not fluently linked to each other.<br>There may be limited/overuse of cohesive devices with some inaccuracy.<br>The writing may be repetitive due to inadequate and/or inaccurate use of reference and substitution.<br>Paragraphing may be inadequate or missing.</td>
            <td>The resource is limited but minimally adequate for the task.<br>Simple vocabulary may be used accurately but the range does not permit much variation in expression.<br>There may be frequent lapses in the appropriacy of word choice and a lack of flexibility is apparent in frequent simplifications and/or repetitions.<br>Errors in spelling and/or word formation may be noticeable and may cause some difficulty for the reader.</td>
            <td>The range of structures is limited and rather repetitive.<br>Although complex sentences are attempted, they tend to be faulty, and the greatest accuracy is achieved on simple sentences.<br>Grammatical errors may be frequent and cause some difficulty for the reader.<br>Punctuation may be faulty.</td>
        </tr>
        
        <!-- Band 4 -->
        <tr>
            <td><strong>4</strong></td>
            <td>The prompt is tackled in a minimal way, or the answer is tangential, possibly due to some misunderstanding of the prompt. The format may be inappropriate.<br>A position is discernible, but the reader has to read carefully to find it.<br>Main ideas are difficult to identify and such ideas that are identifiable may lack relevance, clarity and/or support.<br>Large parts of the response may be repetitive.</td>
            <td>Information and ideas are evident but not arranged coherently and there is no clear progression within the response.<br>Relationships between ideas can be undear and/or inadequately marked. There is some use of basic cohesive devices, which may be inaccurate or repetitive.<br>There is inaccurate use or a lack of substitution or referencing.<br>There may be no paragraphing and/or no clear main topic within paragraphs.</td>
            <td>The resource is limited and inadequate for or unrelated to the task. Vocabulary is basic and may be used repetitively.<br>There may be inappropriate use of lexical chunks (e.g. memorised phrases, formulaic language and/or language from the input material).<br>Inappropriate word choice and/or errors in word formation and/or in spelling may impede meaning.</td>
            <td>A very limited range of structures is used.<br>Subordinate clauses are rare and simple sentences predominate.<br>Some structures are produced accurately but grammatical errors are frequent and may impede meaning.<br>Punctuation is often faulty or inadequate.</td>
        </tr>
        
        <!-- Band 3 -->
        <tr>
            <td><strong>3</strong></td>
            <td>No part of the prompt is adequately addressed, or the prompt has been misunderstood.<br>No relevant position can be identified, and/or there is little direct response to the question/s.<br>There are few ideas, and these may be irrelevant or insufficiently developed.</td>
            <td>There is no apparent logical organisation. Ideas are discernible but difficult to relate to each other.<br>Those used do not necessarily indicate a logical relationship between ideas.<br>There is difficulty in identifying referencing.<br>There are attempts at paragraphing which are unhelpful.</td>
            <td>The resource is inadequate (which may be due to the response being significantly underlength). Possible over-dependence on input material or memorised language.<br>Control of word choice and/or spelling is very limited, and errors predominate. These errors may severely impede meaning.</td>
            <td>Sentence forms are attempted, but errors in grammar and punctuation predominate (except in memorised phrases or those taken from the input material). This prevents most meaning from coming through.<br>Length may be insufficient to provide evidence of control of sentence forms.</td>
        </tr>
        
        <!-- Band 2 -->
        <tr>
            <td><strong>2</strong></td>
            <td>The content is barely related to the prompt.<br>No position can be identified.<br>There may be glimpses of one or two ideas without development.</td>
            <td>Any attempts at paragraphing are unhelpful.<br>There is little relevant message, or the entire response may be off-topic.<br>There is little evidence of control of organisational features.</td>
            <td>The resource is extremely limited with few recognisable strings, apart from memorised phrases.<br>There is no apparent control of word formation and/or spelling.</td>
            <td>There is little or no evidence of sentence forms (except in memorised phrases).</td>
        </tr>
        
        <!-- Band 1 -->
        <tr>
            <td><strong>1</strong></td>
            <td>Responses of 20 words or fewer are rated at Band 1.<br>The content is wholly unrelated to the prompt.<br>Any copied rubric must be discounted.</td>
            <td>Responses of 20 words or fewer are rated at Band 1.<br>The writing fails to communicate any message and appears to be by a virtual non-writer.</td>
            <td>Responses of 20 words or fewer are rated at Band 1.<br>No resource is apparent, except for a few isolated words.</td>
            <td>Responses of 20 words or fewer are rated at Band 1.<br>No rateable language is evident.</td>
        </tr>
        
        <!-- Band 0 -->
        <tr>
            <td><strong>0</strong></td>
            <td>Should only be used where a candidate did not attend or attempt the question in any way, used a language other than English throughout, or where there is proof that a candidate's answer has been totally memorised.</td>
            <td colspan="3" style="text-align:center; font-style:italic;">No rateable language is evident.</td>
        </tr>
    </tbody>
</table>

These are official band descriptors for a task 2 essay; assessment should be based on them. don't mark each criteria with half bands, like 6.5 or 7,5; it should be an integer number.

Respond ONLY with valid JSON in this exact shape, no prose, no markdown fences:
{
  "overall": 7.0,
  "scores": { "TR": 7, "CC": 7, "LR": 6.5, "GRA": 7 },
  "feedback": {
    "TR": "…2–3 sentences referencing specific parts of the essay…",
    "CC": "…",
    "LR": "…",
    "GRA": "…"
  },
  "annotated_issues": [
    { "quote": "exact phrase from essay", "issue": "…", "suggestion": "…" }
  ],
  "summary": "2–3 sentence overall summary",
  "next_steps": ["concrete improvement 1", "concrete improvement 2", "concrete improvement 3"]
}`;

export const essayEvaluation = async (req, res, next) => {
    try{
        const {userId} = req.user;
        const {prompt, essay} = req.body;

        if(!prompt){
            return res.status(400).json({
                message: "Topic is not sent by user",
                data: {
                    success: false
                }
            });
        }

        if (!essay || essay.split(/\s+/).length < 50) {
            return res.status(400).json({
                message: "Essay too short or not entered",
                data: {
                    success: false,
                }
            });
        }

//         const msg = await client.messages.create({
//             model: "claude-sonnet-4-6",
//             max_tokens: 2000,
//             system: EVALUATOR_SYSTEM,
//             messages: [
//                 { role: "user", content: `TASK PROMPT:\n${prompt}\n\nCANDIDATE ESSAY:\n${essay}` },
//             ],
//         });
//
//         const text = msg.content[0].type === "text" ? msg.content[0].text : "";
//         // const text = msg.content[0].type === "text" ? msg.content[0].text : "";
//
// // Strip ```json ... ``` or ``` ... ``` fences if present
//         const cleaned = text
//             .trim()
//             .replace(/^```(?:json)?\s*/i, "")  // remove opening fence
//             .replace(/\s*```$/, "");            // remove closing fence
//
//         const result = JSON.parse(cleaned);
//         const saveEssayEvaluation = await essayFeedbackSave(userId, prompt, essay, result);
//         if(saveEssayEvaluation.message === "Essay feedback successfully saved." && saveEssayEvaluation.data.success){
//             res.json({...result, essayId: saveEssayEvaluation.data.newEssayId});
//         }else{
//             return res.status(500).json({
//                 message: saveEssayEvaluation.message,
//                 data: {
//                     success: false
//                 }
//             })
//         }

        const job = await essayQueue.add(
            "evaluate",
            {
                userId,
                prompt,
                essay
            }
        );

        return res.status(202).json({
            message: "Essay queued",
            data: {
                success: true,
                jobId: job.id
            }
        });
    }catch(err){
        next(err);
    }
}

export const anonymousEssayEvaluation = async (req, res, next) => {
    try{
        // const {userId} = req.user;
        const {prompt, essay} = req.body;

        if(!prompt){
            return res.status(400).json({
                message: "Topic is not sent by user",
                data: {
                    success: false
                }
            });
        }

        if (!essay || essay.split(/\s+/).length < 50) {
            return res.status(400).json({
                message: "Essay too short or not entered",
                data: {
                    success: false,
                }
            });
        }

//         const msg = await client.messages.create({
//             model: "claude-sonnet-4-6",
//             max_tokens: 2000,
//             system: EVALUATOR_SYSTEM,
//             messages: [
//                 { role: "user", content: `TASK PROMPT:\n${prompt}\n\nCANDIDATE ESSAY:\n${essay}` },
//             ],
//         });

//         const text = msg.content[0].type === "text" ? msg.content[0].text : "";
//         // const text = msg.content[0].type === "text" ? msg.content[0].text : "";

// // Strip ```json ... ``` or ``` ... ``` fences if present
//         const cleaned = text
//             .trim()
//             .replace(/^```(?:json)?\s*/i, "")  // remove opening fence
//             .replace(/\s*```$/, "");            // remove closing fence

//         const result = JSON.parse(cleaned);


        // const saveEssayEvaluation = await essayFeedbackSave(userId, prompt, essay, result);
        // if(saveEssayEvaluation.message === "Essay feedback successfully saved." && saveEssayEvaluation.data.success){
        //     res.json({...result, essayId: saveEssayEvaluation.data.newEssayId});
        // }else{
        //     return res.status(500).json({
        //         message: saveEssayEvaluation.message,
        //         data: {
        //             success: false
        //         }
        //     })
        // }
        // return res.json({...result})

        const userId = crypto.randomUUID();
        const job = await essayQueue.add(
            "evaluate",
            {
                userId, // Anonymous users don't have a userId
                prompt,
                essay,
                anonymousUser: true
            }
        );

        return res.status(202).json({
            message: "Anonymous Essay queued",
            data: {
                success: true,
                jobId: job.id,
                userId
            }
        });
    }catch(err){
        next(err);
    }
}

export const getUserEssay = async (req, res, next) => {
    try{
        const {userId} = req.user;
        const limit = Math.min(Number(req.query.limit) || 5, 10);
        const page = Math.max(Number(req.query.page) || 1, 1);
        const getUserEssayFromDB = await getUserEssayAndFeedbackById(userId, limit, page);

        return res.json(getUserEssayFromDB);
    }catch(err){
        next(err);
    }
}

export const getEssayFeedbackById = async (req, res, next) => {
    try{
        const {id} = req.params;
        const getEssayFeedback = await getEssayFeedbackByIdFromDb(id);

        return res.json(getEssayFeedback);
    }catch(err){
        next(err);
    }
}

export const getUserIELTSScoreData = async (req, res, next) => {
    try {
        const {userId} = req.user;
        const getUserIELTSScoresFromDb = await getUserIELTSScores(userId);

        return res.json(getUserIELTSScoresFromDb);
    }catch(err){
        next(err);
    }
}

export const getLeaderBoard = async (req, res, next) => {
    try {
        const {userId} = req.user;
        const leaderBoard = await getLeaderBoardFromDb();
        return res.json(leaderBoard);
    }catch(err){
        next(err);
    }
}

export const getEssayFeedbackPDFFile = async (req, res, next) => {
    try{
        const {id} = req.params;
        const pdfBuffer = await getEssayFeedbackFromDbForPDFFile(id);

        res.setHeader("Content-Type", "application/pdf");
        res.setHeader("Content-Disposition", `attachment; filename=essay-report-${new Date().toISOString().split('T')[0]}.pdf`);

        console.log(pdfBuffer);
        console.log(pdfBuffer?.length);
        res.send(pdfBuffer);
    }catch (err){
        next(err);
    }
}