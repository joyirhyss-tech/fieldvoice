/** Curated quote bank — 500+ voices prioritizing Black, Brown, Indigenous, and women of color */

export interface QuoteEntry {
  text: string;
  attribution: string;
  tradition?: string; // for wisdom traditions: "Lakota", "Yoruba", "Buddhist", etc.
}

const QUOTES: QuoteEntry[] = [
  // ═══════════════════════════════════════════════════════════════════════════
  // BLACK WOMEN — Literary Giants
  // ═══════════════════════════════════════════════════════════════════════════

  // Toni Morrison
  {
    text: 'If there\'s a book that you want to read, but it hasn\'t been written yet, then you must write it.',
    attribution: 'Toni Morrison',
  },
  {
    text: 'You wanna fly, you got to give up the shit that weighs you down.',
    attribution: 'Toni Morrison',
  },
  {
    text: 'Freeing yourself was one thing, claiming ownership of that freed self was another.',
    attribution: 'Toni Morrison',
  },
  {
    text: 'The function of freedom is to free someone else.',
    attribution: 'Toni Morrison',
  },
  {
    text: 'If you surrendered to the air, you could ride it.',
    attribution: 'Toni Morrison',
  },
  {
    text: 'You are your best thing.',
    attribution: 'Toni Morrison',
  },
  {
    text: 'Make up a story. For our sake and yours forget your name in the street; tell us what the world has been to you in the dark places and in the light.',
    attribution: 'Toni Morrison',
  },
  {
    text: 'The ability of writers and poets to imagine what is not the self, to familiarize the strange and mystify the familiar, is the test of their power.',
    attribution: 'Toni Morrison',
  },
  {
    text: 'Definitions belong to the definers, not the defined.',
    attribution: 'Toni Morrison',
  },
  {
    text: 'At some point in life the world\'s beauty becomes enough.',
    attribution: 'Toni Morrison',
  },
  {
    text: 'If you are free, you need to free somebody else. If you have some power, then your job is to empower somebody else.',
    attribution: 'Toni Morrison',
  },

  // Alice Walker
  {
    text: 'The most common way people give up their power is by thinking they don\'t have any.',
    attribution: 'Alice Walker',
  },
  {
    text: 'Activism is my rent for living on this planet.',
    attribution: 'Alice Walker',
  },
  {
    text: 'No person is your friend who demands your silence, or denies your right to grow.',
    attribution: 'Alice Walker',
  },
  {
    text: 'The quietly pacifist peaceful always die to make room for men who shout.',
    attribution: 'Alice Walker',
  },
  {
    text: 'Expect nothing. Live frugally on surprise.',
    attribution: 'Alice Walker',
  },
  {
    text: 'In nature, nothing is perfect and everything is perfect.',
    attribution: 'Alice Walker',
  },
  {
    text: 'The animals of the world exist for their own reasons. They were not made for humans any more than Black people were made for white, or women created for men.',
    attribution: 'Alice Walker',
  },

  // Zora Neale Hurston
  {
    text: 'If you are silent about your pain, they\'ll kill you and say you enjoyed it.',
    attribution: 'Zora Neale Hurston',
  },
  {
    text: 'There are years that ask questions and years that answer.',
    attribution: 'Zora Neale Hurston',
  },
  {
    text: 'I have been in sorrow\'s kitchen and licked out all the pots.',
    attribution: 'Zora Neale Hurston',
  },
  {
    text: 'Research is formalized curiosity. It is poking and prying with a purpose.',
    attribution: 'Zora Neale Hurston',
  },
  {
    text: 'Those that don\'t got it, can\'t show it. Those that got it, can\'t hide it.',
    attribution: 'Zora Neale Hurston',
  },
  {
    text: 'No matter how far a person can go the horizon is still way beyond you.',
    attribution: 'Zora Neale Hurston',
  },

  // Gwendolyn Brooks
  {
    text: 'We are each other\'s harvest; we are each other\'s business; we are each other\'s magnitude and bond.',
    attribution: 'Gwendolyn Brooks',
  },
  {
    text: 'Art hurts. Art urges voyages, and it is easier to stay at home.',
    attribution: 'Gwendolyn Brooks',
  },
  {
    text: 'Books are meat and medicine and flame and flight and flower.',
    attribution: 'Gwendolyn Brooks',
  },
  {
    text: 'Live not for battles won. Live not for the end-of-the-song. Live in the along.',
    attribution: 'Gwendolyn Brooks',
  },

  // Lucille Clifton
  {
    text: 'Won\'t you celebrate with me what i have shaped into a kind of life? I had no model.',
    attribution: 'Lucille Clifton',
  },
  {
    text: 'They ask me to remember but they want me to remember their memories and I keep on remembering mine.',
    attribution: 'Lucille Clifton',
  },
  {
    text: 'Every pair of eyes facing you has probably experienced something you could not endure.',
    attribution: 'Lucille Clifton',
  },
  {
    text: 'I am running into a new year and the old years blow back like a wind that I catch in my body and survey.',
    attribution: 'Lucille Clifton',
  },

  // Nikki Giovanni
  {
    text: 'A lot of people resist transition and therefore never allow themselves to enjoy who they are.',
    attribution: 'Nikki Giovanni',
  },
  {
    text: 'Deal with yourself as an individual worthy of respect and make everyone else deal with you the same way.',
    attribution: 'Nikki Giovanni',
  },
  {
    text: 'We love because it\'s the only true adventure.',
    attribution: 'Nikki Giovanni',
  },
  {
    text: 'Writers don\'t write from experience, although many are reluctant to admit that they don\'t. Writers write from empathy.',
    attribution: 'Nikki Giovanni',
  },
  {
    text: 'If now isn\'t a good time for the truth I don\'t see when we\'ll get to it.',
    attribution: 'Nikki Giovanni',
  },

  // Sonia Sanchez
  {
    text: 'I see the world through the eyes of a woman who has been a warrior.',
    attribution: 'Sonia Sanchez',
  },
  {
    text: 'Poetry is a language pared down to its essentials. It\'s the bones of language.',
    attribution: 'Sonia Sanchez',
  },
  {
    text: 'We are all part of the earth. Respect it and it will sustain us all.',
    attribution: 'Sonia Sanchez',
  },

  // June Jordan
  {
    text: 'We are the ones we have been waiting for.',
    attribution: 'June Jordan',
  },
  {
    text: 'Poetry is a political act because it involves telling the truth.',
    attribution: 'June Jordan',
  },
  {
    text: 'As a poet and writer, I deeply love and I deeply hate what I see going on around me.',
    attribution: 'June Jordan',
  },

  // Ntozake Shange
  {
    text: 'Where there is a woman there is magic.',
    attribution: 'Ntozake Shange',
  },
  {
    text: 'I found god in myself and i loved her fiercely.',
    attribution: 'Ntozake Shange',
  },

  // Toni Cade Bambara
  {
    text: 'The role of the artist is to make the revolution irresistible.',
    attribution: 'Toni Cade Bambara',
  },
  {
    text: 'The dream is real, my friends. The failure to make it work is the unreality.',
    attribution: 'Toni Cade Bambara',
  },

  // Mari Evans
  {
    text: 'I am a Black woman tall as a cypress strong beyond all definition.',
    attribution: 'Mari Evans',
  },

  // Margaret Walker
  {
    text: 'Friends and good manners will carry you where money won\'t go.',
    attribution: 'Margaret Walker',
  },

  // Octavia Butler
  {
    text: 'All that you touch you change. All that you change changes you.',
    attribution: 'Octavia Butler',
  },
  {
    text: 'In order to rise from its own ashes a phoenix first must burn.',
    attribution: 'Octavia Butler',
  },
  {
    text: 'Choose your leaders with wisdom and forethought. To be led by a coward is to be controlled by all that the coward fears.',
    attribution: 'Octavia Butler',
  },
  {
    text: 'Positive obsession is about not being able to stop just because you\'re afraid and full of doubts. Do it anyway.',
    attribution: 'Octavia Butler',
  },
  {
    text: 'There is nothing new under the sun, but there are new suns.',
    attribution: 'Octavia Butler',
  },
  {
    text: 'Every story I create, creates me. I write to create myself.',
    attribution: 'Octavia Butler',
  },

  // Lorraine Hansberry
  {
    text: 'Never be afraid to sit awhile and think.',
    attribution: 'Lorraine Hansberry',
  },
  {
    text: 'The thing that makes you exceptional, if you are at all, is inevitably that which must also make you lonely.',
    attribution: 'Lorraine Hansberry',
  },

  // Phillis Wheatley
  {
    text: 'In every human breast, God has implanted a principle, which we call love of freedom; it is impatient of oppression and pants for deliverance.',
    attribution: 'Phillis Wheatley',
  },

  // Maya Angelou
  {
    text: 'There is no greater agony than bearing an untold story inside you.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'We delight in the beauty of the butterfly, but rarely admit the changes it has gone through to achieve that beauty.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'When someone shows you who they are, believe them the first time.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'I\'ve learned that people will forget what you said, people will forget what you did, but people will never forget how you made them feel.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'You may not control all the events that happen to you, but you can decide not to be reduced by them.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'Each time a woman stands up for herself, without knowing it possibly, without claiming it, she stands up for all women.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'My mission in life is not merely to survive, but to thrive.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'When you know better, you do better.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'Courage is the most important of all the virtues because without courage, you can\'t practice any other virtue consistently.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'If you\'re always trying to be normal, you will never know how amazing you can be.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'I can be changed by what happens to me. But I refuse to be reduced by it.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'Nothing will work unless you do.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'Hate, it has caused a lot of problems in the world, but has not solved one yet.',
    attribution: 'Maya Angelou',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLACK WOMEN — Civil Rights & Activism
  // ═══════════════════════════════════════════════════════════════════════════

  // Fannie Lou Hamer
  {
    text: 'I am sick and tired of being sick and tired.',
    attribution: 'Fannie Lou Hamer',
  },
  {
    text: 'Nobody\'s free until everybody\'s free.',
    attribution: 'Fannie Lou Hamer',
  },
  {
    text: 'Whether you have a Ph.D., D.D., or no D, we\'re in this bag together.',
    attribution: 'Fannie Lou Hamer',
  },
  {
    text: 'You can pray until you faint, but unless you get up and try to do something, God is not going to put it in your lap.',
    attribution: 'Fannie Lou Hamer',
  },
  {
    text: 'There is one thing you have got to learn about our movement. Three people are better than no people.',
    attribution: 'Fannie Lou Hamer',
  },

  // Ella Baker
  {
    text: 'Give light and people will find the way.',
    attribution: 'Ella Baker',
  },
  {
    text: 'Strong people don\'t need strong leaders.',
    attribution: 'Ella Baker',
  },
  {
    text: 'Until the killing of Black men, Black mothers\' sons, becomes as important to the rest of the country as the killing of a white mother\'s son, we who believe in freedom cannot rest.',
    attribution: 'Ella Baker',
  },
  {
    text: 'One of the things that has to be faced is the process of waiting to change the system, how much we have got to do to find out who we are.',
    attribution: 'Ella Baker',
  },

  // Diane Nash
  {
    text: 'Freedom, by definition, is people realizing that they are their own leaders.',
    attribution: 'Diane Nash',
  },

  // Ruby Bridges
  {
    text: 'Each and every one of us is born with a clean heart. Our babies know nothing about hate or racism.',
    attribution: 'Ruby Bridges',
  },
  {
    text: 'Racism is a grown-up disease and we must stop using our children to spread it.',
    attribution: 'Ruby Bridges',
  },
  {
    text: 'Don\'t follow the path. Go where there is no path and begin the trail.',
    attribution: 'Ruby Bridges',
  },

  // Septima Poinsette Clark
  {
    text: 'I have great belief in the fact that whenever there is chaos, it creates wonderful thinking. I consider chaos a gift.',
    attribution: 'Septima Poinsette Clark',
  },

  // Dorothy Height
  {
    text: 'I want to be remembered as someone who used herself and anything she could touch to work for justice and freedom.',
    attribution: 'Dorothy Height',
  },
  {
    text: 'If the time is not ripe, we have to ripen the time.',
    attribution: 'Dorothy Height',
  },
  {
    text: 'Greatness is not measured by what a man or woman accomplishes, but by the opposition he or she has overcome.',
    attribution: 'Dorothy Height',
  },

  // Marian Wright Edelman
  {
    text: 'You really can change the world if you care enough.',
    attribution: 'Marian Wright Edelman',
  },
  {
    text: 'Service is the rent we pay for being. It is the very purpose of life and not something you do in your spare time.',
    attribution: 'Marian Wright Edelman',
  },
  {
    text: 'Education is for improving the lives of others and for leaving your community and world better than you found it.',
    attribution: 'Marian Wright Edelman',
  },
  {
    text: 'If you don\'t like the way the world is, you change it. You have an obligation to change it. You just do it one step at a time.',
    attribution: 'Marian Wright Edelman',
  },
  {
    text: 'Never work just for money or for power. They won\'t save your soul or help you sleep at night.',
    attribution: 'Marian Wright Edelman',
  },

  // Coretta Scott King
  {
    text: 'Struggle is a never-ending process. Freedom is never really won, you earn it and win it in every generation.',
    attribution: 'Coretta Scott King',
  },
  {
    text: 'The greatness of a community is most accurately measured by the compassionate actions of its members.',
    attribution: 'Coretta Scott King',
  },
  {
    text: 'Hate is too great a burden to bear. It injures the hater more than it injures the hated.',
    attribution: 'Coretta Scott King',
  },

  // Sojourner Truth
  {
    text: 'Truth is powerful and it prevails.',
    attribution: 'Sojourner Truth',
  },
  {
    text: 'If women want any rights more than they\'s got, why don\'t they just take them, and not be talking about it.',
    attribution: 'Sojourner Truth',
  },
  {
    text: 'I feel safe in the midst of my enemies, for the truth is all powerful and will prevail.',
    attribution: 'Sojourner Truth',
  },
  {
    text: 'If the first woman God ever made was strong enough to turn the world upside down all alone, these women together ought to be able to turn it back.',
    attribution: 'Sojourner Truth',
  },

  // Harriet Tubman
  {
    text: 'Every great dream begins with a dreamer. Always remember, you have within you the strength, the patience, and the passion to reach for the stars to change the world.',
    attribution: 'Harriet Tubman',
  },
  {
    text: 'I freed a thousand slaves. I could have freed a thousand more if only they knew they were slaves.',
    attribution: 'Harriet Tubman',
  },
  {
    text: 'I had reasoned this out in my mind; there was one of two things I had a right to, liberty, or death.',
    attribution: 'Harriet Tubman',
  },

  // Ida B. Wells
  {
    text: 'The way to right wrongs is to turn the light of truth upon them.',
    attribution: 'Ida B. Wells',
  },
  {
    text: 'One had better die fighting against injustice than to die like a dog or a rat in a trap.',
    attribution: 'Ida B. Wells',
  },
  {
    text: 'The people must know before they can act, and there is no educator to compare with the press.',
    attribution: 'Ida B. Wells',
  },

  // Mary Church Terrell
  {
    text: 'Please stop using the word "tolerance." It implies condescension. Try "acceptance."',
    attribution: 'Mary Church Terrell',
  },
  {
    text: 'A white woman has only one handicap to overcome, a great one, true, her sex; a colored woman faces two, her sex and her race.',
    attribution: 'Mary Church Terrell',
  },

  // Anna Julia Cooper
  {
    text: 'Only the Black woman can say when and where I enter, in the quiet, undisputed dignity of my womanhood, then and there the whole race enters with me.',
    attribution: 'Anna Julia Cooper',
  },
  {
    text: 'The cause of freedom is not the cause of a race or a sect, a party or a class. It is the cause of humankind.',
    attribution: 'Anna Julia Cooper',
  },
  {
    text: 'There is a feminine as well as a masculine side to truth; these are related not as combatants but as complements.',
    attribution: 'Anna Julia Cooper',
  },

  // Mary McLeod Bethune
  {
    text: 'Invest in the human soul. Who knows, it might be a diamond in the rough.',
    attribution: 'Mary McLeod Bethune',
  },
  {
    text: 'The whole world opened to me when I learned to read.',
    attribution: 'Mary McLeod Bethune',
  },
  {
    text: 'Faith is the first factor in a life devoted to service. Without it, nothing is possible. With it, nothing is impossible.',
    attribution: 'Mary McLeod Bethune',
  },

  // Pauli Murray
  {
    text: 'One person plus one typewriter constitutes a movement.',
    attribution: 'Pauli Murray',
  },
  {
    text: 'When my brothers try to draw a circle to exclude me, I shall draw a larger circle to include them.',
    attribution: 'Pauli Murray',
  },
  {
    text: 'The only weapon with which the oppressed can meet the oppressor is organization.',
    attribution: 'Pauli Murray',
  },

  // Barbara Jordan
  {
    text: 'What the people want is very simple: they want an America as good as its promise.',
    attribution: 'Barbara Jordan',
  },
  {
    text: 'We, the people. It is a very eloquent beginning. But when that document was completed, I was not included.',
    attribution: 'Barbara Jordan',
  },
  {
    text: 'Do not call for Black power or green power. Call for brain power.',
    attribution: 'Barbara Jordan',
  },
  {
    text: 'I believe that women have a capacity for understanding and compassion which a man structurally does not have.',
    attribution: 'Barbara Jordan',
  },

  // Shirley Chisholm
  {
    text: 'If they don\'t give you a seat at the table, bring a folding chair.',
    attribution: 'Shirley Chisholm',
  },
  {
    text: 'Service is the rent that you pay for room on this earth.',
    attribution: 'Shirley Chisholm',
  },
  {
    text: 'You don\'t make progress by standing on the sidelines, whimpering and complaining. You make progress by implementing ideas.',
    attribution: 'Shirley Chisholm',
  },
  {
    text: 'Tremendous amounts of talent are lost to our society just because that talent wears a skirt.',
    attribution: 'Shirley Chisholm',
  },
  {
    text: 'I want to be remembered as a woman who dared to be a catalyst of change.',
    attribution: 'Shirley Chisholm',
  },
  {
    text: 'I am and always will be a catalyst for change.',
    attribution: 'Shirley Chisholm',
  },

  // Angela Davis
  {
    text: 'I am no longer accepting the things I cannot change. I am changing the things I cannot accept.',
    attribution: 'Angela Davis',
  },
  {
    text: 'You have to act as if it were possible to radically transform the world. And you have to do it all the time.',
    attribution: 'Angela Davis',
  },
  {
    text: 'In a racist society it is not enough to be non-racist, we must be anti-racist.',
    attribution: 'Angela Davis',
  },
  {
    text: 'Radical simply means grasping things at the root.',
    attribution: 'Angela Davis',
  },
  {
    text: 'Prisons do not disappear social problems, they disappear human beings.',
    attribution: 'Angela Davis',
  },

  // Assata Shakur
  {
    text: 'Nobody in the world, nobody in history, has ever gotten their freedom by appealing to the moral sense of the people who were oppressing them.',
    attribution: 'Assata Shakur',
  },
  {
    text: 'It is our duty to fight for our freedom. It is our duty to win. We must love each other and support each other.',
    attribution: 'Assata Shakur',
  },

  // Audre Lorde
  {
    text: 'When I dare to be powerful, to use my strength in the service of my vision, then it becomes less and less important whether I am afraid.',
    attribution: 'Audre Lorde',
  },
  {
    text: 'Your silence will not protect you.',
    attribution: 'Audre Lorde',
  },
  {
    text: 'It is not our differences that divide us. It is our inability to recognize, accept, and celebrate those differences.',
    attribution: 'Audre Lorde',
  },
  {
    text: 'Caring for myself is not self-indulgence, it is self-preservation, and that is an act of political warfare.',
    attribution: 'Audre Lorde',
  },
  {
    text: 'The master\'s tools will never dismantle the master\'s house.',
    attribution: 'Audre Lorde',
  },
  {
    text: 'I am not free while any woman is unfree, even when her shackles are very different from my own.',
    attribution: 'Audre Lorde',
  },
  {
    text: 'Revolution is not a one-time event.',
    attribution: 'Audre Lorde',
  },
  {
    text: 'There is no such thing as a single-issue struggle because we do not live single-issue lives.',
    attribution: 'Audre Lorde',
  },
  {
    text: 'I am deliberate and afraid of nothing.',
    attribution: 'Audre Lorde',
  },
  {
    text: 'If I didn\'t define myself for myself, I would be crunched into other people\'s fantasies for me and eaten alive.',
    attribution: 'Audre Lorde',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLACK WOMEN — Contemporary Voices
  // ═══════════════════════════════════════════════════════════════════════════

  // Tarana Burke
  {
    text: 'What I want from this movement is healing. I want it to be about restoring humanity to survivors.',
    attribution: 'Tarana Burke',
  },
  {
    text: 'It\'s beyond a hashtag. It\'s the start of a larger conversation and a movement for radical community healing.',
    attribution: 'Tarana Burke',
  },
  {
    text: 'Sometimes you just have to be the first to speak up.',
    attribution: 'Tarana Burke',
  },

  // Stacey Abrams
  {
    text: 'We do not have to accept what we cannot change. We have to change what we cannot accept.',
    attribution: 'Stacey Abrams',
  },
  {
    text: 'Be intentional about your purpose and ferocious about your goals.',
    attribution: 'Stacey Abrams',
  },
  {
    text: 'You cannot have my voice if you have not earned my trust.',
    attribution: 'Stacey Abrams',
  },
  {
    text: 'I believe in the power of community, and I believe in the power of us working together.',
    attribution: 'Stacey Abrams',
  },

  // Michelle Obama
  {
    text: 'When they go low, we go high.',
    attribution: 'Michelle Obama',
  },
  {
    text: 'There is no limit to what we, as women, can accomplish.',
    attribution: 'Michelle Obama',
  },
  {
    text: 'Your story is what you have, what you will always have. It is something to own.',
    attribution: 'Michelle Obama',
  },
  {
    text: 'Success isn\'t about how much money you make. It\'s about the difference you make in people\'s lives.',
    attribution: 'Michelle Obama',
  },
  {
    text: 'When you\'ve worked hard, and done well, and walked through that doorway of opportunity, you do not slam it shut behind you.',
    attribution: 'Michelle Obama',
  },
  {
    text: 'Do we settle for the world as it is, or do we work for the world as it should be?',
    attribution: 'Michelle Obama',
  },
  {
    text: 'For me, becoming isn\'t about arriving somewhere or achieving a certain aim. I see it as forward motion, a means of evolving.',
    attribution: 'Michelle Obama',
  },

  // Patrisse Cullors
  {
    text: 'We are not going to stand by and watch our community be terrorized. We are going to take a stand.',
    attribution: 'Patrisse Cullors',
  },

  // Brittany Packnett Cunningham
  {
    text: 'Confidence is the necessary spark before everything that follows.',
    attribution: 'Brittany Packnett Cunningham',
  },
  {
    text: 'We need to start making the invisible visible.',
    attribution: 'Brittany Packnett Cunningham',
  },
  {
    text: 'Our liberation is bound together. There is no freedom for any of us until there is freedom for all of us.',
    attribution: 'Brittany Packnett Cunningham',
  },

  // Bree Newsome
  {
    text: 'You are enough to start a movement. Individual acts of courage can spark change.',
    attribution: 'Bree Newsome',
  },

  // Alicia Garza
  {
    text: 'Our collective liberation depends on collective action.',
    attribution: 'Alicia Garza',
  },
  {
    text: 'When we say Black lives matter, we are talking about the ways in which Black people are deprived of our basic human rights and dignity.',
    attribution: 'Alicia Garza',
  },
  {
    text: 'When you fight for something you believe in and you tell the truth, you will have naysayers.',
    attribution: 'Alicia Garza',
  },

  // Opal Tometi
  {
    text: 'We have an opportunity and a responsibility to build a world where every person can live with dignity.',
    attribution: 'Opal Tometi',
  },

  // Kimberlé Crenshaw
  {
    text: 'If you don\'t have a lens that\'s been trained to look at how various forms of discrimination come together, you\'re unlikely to develop a set of policies to address the problem.',
    attribution: 'Kimberlé Crenshaw',
  },
  {
    text: 'Treating different things the same can generate as much inequality as treating the same things differently.',
    attribution: 'Kimberlé Crenshaw',
  },
  {
    text: 'Intersectionality is not just about identity, it\'s about how structures make certain identities the consequence of and the vehicle for vulnerability.',
    attribution: 'Kimberlé Crenshaw',
  },

  // bell hooks
  {
    text: 'For me, forgiveness and compassion are always linked: how do we hold people accountable for wrongdoing and yet at the same time remain in touch with their humanity?',
    attribution: 'bell hooks',
  },
  {
    text: 'The moment we choose to love we begin to move against domination, against oppression.',
    attribution: 'bell hooks',
  },
  {
    text: 'Life-transforming ideas have always come to me through books.',
    attribution: 'bell hooks',
  },
  {
    text: 'To begin by always thinking of love as an action rather than a feeling is one way in which anyone using the word in this manner automatically assumes accountability and responsibility.',
    attribution: 'bell hooks',
  },
  {
    text: 'What we do is more important than what we say or what we say we believe.',
    attribution: 'bell hooks',
  },
  {
    text: 'Knowing how to be solitary is central to the art of loving. When we can be alone, we can be with others without using them as a means of escape.',
    attribution: 'bell hooks',
  },
  {
    text: 'I will not have my life narrowed down. I will not bow down to somebody else\'s whim or to someone else\'s ignorance.',
    attribution: 'bell hooks',
  },
  {
    text: 'Beloved community is formed not by the eradication of difference but by its affirmation.',
    attribution: 'bell hooks',
  },
  {
    text: 'Rarely, if ever, are any of us healed in isolation. Healing is an act of communion.',
    attribution: 'bell hooks',
  },
  {
    text: 'Sometimes people try to destroy you, precisely because they recognize your power.',
    attribution: 'bell hooks',
  },

  // Roxane Gay
  {
    text: 'I believe in the power of storytelling, that stories can change the world.',
    attribution: 'Roxane Gay',
  },
  {
    text: 'You don\'t necessarily need to be brave. You just need to show up.',
    attribution: 'Roxane Gay',
  },
  {
    text: 'What I know for sure is that I am human and I am messy.',
    attribution: 'Roxane Gay',
  },

  // Nikole Hannah-Jones
  {
    text: 'If you want to understand this country\'s history, you have to understand Black history.',
    attribution: 'Nikole Hannah-Jones',
  },

  // Melissa Harris-Perry
  {
    text: 'Belonging is the ability to show up as your authentic self.',
    attribution: 'Melissa Harris-Perry',
  },

  // Patricia Hill Collins
  {
    text: 'Oppression is full of such contradictions because finding ways to resist oppression is never simple.',
    attribution: 'Patricia Hill Collins',
  },
  {
    text: 'Self-definition and self-valuation are not luxuries; they are necessary for Black women\'s survival.',
    attribution: 'Patricia Hill Collins',
  },

  // Beverly Daniel Tatum
  {
    text: 'The task of interrupting racism is one that falls to all of us.',
    attribution: 'Beverly Daniel Tatum',
  },

  // Gloria Ladson-Billings
  {
    text: 'The problem is not diversity. The problem is inequity.',
    attribution: 'Gloria Ladson-Billings',
  },

  // Lisa Delpit
  {
    text: 'We do not really see through our eyes or hear through our ears, but through our beliefs.',
    attribution: 'Lisa Delpit',
  },
  {
    text: 'Good teachers know that real learning comes from the kind of challenge that makes you uncomfortable.',
    attribution: 'Lisa Delpit',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLACK WOMEN — Artists & Performers
  // ═══════════════════════════════════════════════════════════════════════════

  // Nina Simone
  {
    text: 'An artist\'s duty, as far as I\'m concerned, is to reflect the times.',
    attribution: 'Nina Simone',
  },
  {
    text: 'You\'ve got to learn to leave the table when love\'s no longer being served.',
    attribution: 'Nina Simone',
  },
  {
    text: 'I\'ll tell you what freedom is to me: no fear.',
    attribution: 'Nina Simone',
  },

  // Josephine Baker
  {
    text: 'I have walked into the palaces of kings and queens and into the houses of presidents. But I could not walk into a hotel in America and get a cup of coffee.',
    attribution: 'Josephine Baker',
  },
  {
    text: 'Surely the day will come when color means nothing more than the skin tone.',
    attribution: 'Josephine Baker',
  },

  // Ruby Dee
  {
    text: 'The kind of beauty I want most is the hard-to-get kind that comes from within: strength, courage, dignity.',
    attribution: 'Ruby Dee',
  },
  {
    text: 'God gave us all something. It doesn\'t matter where you come from.',
    attribution: 'Ruby Dee',
  },

  // Cicely Tyson
  {
    text: 'I have learned not to allow rejection to move me.',
    attribution: 'Cicely Tyson',
  },
  {
    text: 'Challenges make you discover things about yourself that you never really knew.',
    attribution: 'Cicely Tyson',
  },
  {
    text: 'I\'m very selective about the roles I take on because I use my career as my platform.',
    attribution: 'Cicely Tyson',
  },

  // Viola Davis
  {
    text: 'The only thing that separates women of color from anyone else is opportunity.',
    attribution: 'Viola Davis',
  },
  {
    text: 'How do you live in a world that esteems you as less? You fight every day to erase that message.',
    attribution: 'Viola Davis',
  },

  // Beyoncé
  {
    text: 'We need to reshape our own perception of how we view ourselves. We have to step up as women and take the lead.',
    attribution: 'Beyoncé',
  },
  {
    text: 'Power is not given to you. You have to take it.',
    attribution: 'Beyoncé',
  },
  {
    text: 'Your self-worth is determined by you. You don\'t have to depend on someone telling you who you are.',
    attribution: 'Beyoncé',
  },

  // Janelle Monáe
  {
    text: 'Even if it makes others uncomfortable, I will love who I am.',
    attribution: 'Janelle Monáe',
  },
  {
    text: 'Be an individual. Create your own lane.',
    attribution: 'Janelle Monáe',
  },
  {
    text: 'I want young people, young girls, to know that they can achieve anything and that the sky is the limit.',
    attribution: 'Janelle Monáe',
  },

  // Amanda Gorman
  {
    text: 'There is always light, if only we\'re brave enough to see it. If only we\'re brave enough to be it.',
    attribution: 'Amanda Gorman',
  },
  {
    text: 'Somehow we\'ve weathered and witnessed a nation that isn\'t broken, but simply unfinished.',
    attribution: 'Amanda Gorman',
  },
  {
    text: 'We will not march back to what was, but move to what shall be.',
    attribution: 'Amanda Gorman',
  },
  {
    text: 'Being American is more than a pride we inherit. It\'s the past we step into and how we repair it.',
    attribution: 'Amanda Gorman',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLACK WOMEN — Leaders & Professionals
  // ═══════════════════════════════════════════════════════════════════════════

  // Oprah Winfrey
  {
    text: 'Turn your wounds into wisdom.',
    attribution: 'Oprah Winfrey',
  },
  {
    text: 'Real integrity is doing the right thing, knowing that nobody\'s going to know whether you did it or not.',
    attribution: 'Oprah Winfrey',
  },
  {
    text: 'The biggest adventure you can take is to live the life of your dreams.',
    attribution: 'Oprah Winfrey',
  },
  {
    text: 'Leadership is about empathy. It is about having the ability to relate to and connect with people for the purpose of inspiring and empowering their lives.',
    attribution: 'Oprah Winfrey',
  },
  {
    text: 'You get in life what you have the courage to ask for.',
    attribution: 'Oprah Winfrey',
  },
  {
    text: 'The greatest discovery of all time is that a person can change their future by merely changing their attitude.',
    attribution: 'Oprah Winfrey',
  },
  {
    text: 'I trust that everything happens for a reason, even when we\'re not wise enough to see it.',
    attribution: 'Oprah Winfrey',
  },

  // Ursula Burns
  {
    text: 'The notion that you\'re supposed to define yourself by your work is a bit bankrupt. The question should be: how can I contribute?',
    attribution: 'Ursula Burns',
  },
  {
    text: 'Don\'t ever be afraid to step up and step out. Speak up, even if your voice shakes.',
    attribution: 'Ursula Burns',
  },
  {
    text: 'Where you are is not who you are.',
    attribution: 'Ursula Burns',
  },

  // Mellody Hobson
  {
    text: 'I think it is time for us to be comfortable with being uncomfortable.',
    attribution: 'Mellody Hobson',
  },
  {
    text: 'Not talking about race is not going to make it not exist.',
    attribution: 'Mellody Hobson',
  },
  {
    text: 'In the absence of information, we fill in the gaps with our own biases.',
    attribution: 'Mellody Hobson',
  },

  // Rosalind Brewer
  {
    text: 'I try to be very intentional about bringing more people to the table who look different.',
    attribution: 'Rosalind Brewer',
  },
  {
    text: 'Find the one thing that keeps you going and stay focused on it.',
    attribution: 'Rosalind Brewer',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OTHER WOMEN OF COLOR — Indigenous
  // ═══════════════════════════════════════════════════════════════════════════

  // Wilma Mankiller
  {
    text: 'The secret of our success is that we never, never give up.',
    attribution: 'Wilma Mankiller',
  },
  {
    text: 'Growth is a painful process.',
    attribution: 'Wilma Mankiller',
  },
  {
    text: 'In Iroquois society, leaders are the servants of the people.',
    attribution: 'Wilma Mankiller',
  },
  {
    text: 'A lot of young girls have looked to their moms and their aunts and their big sisters, and they see how hard women work and they want to do that too.',
    attribution: 'Wilma Mankiller',
  },
  {
    text: 'I think the happiest people I have ever met are people who are actively engaged in community service.',
    attribution: 'Wilma Mankiller',
  },

  // Winona LaDuke
  {
    text: 'Someone needs to explain to me why wanting clean drinking water makes you an activist.',
    attribution: 'Winona LaDuke',
  },
  {
    text: 'The recovery of the people is tied to the recovery of food, since food itself is medicine.',
    attribution: 'Winona LaDuke',
  },
  {
    text: 'In our way of life, with every decision we make, we always keep in mind the seventh generation of children to come.',
    attribution: 'Winona LaDuke',
  },
  {
    text: 'Power is in the earth; it is in your relationship to the earth.',
    attribution: 'Winona LaDuke',
  },

  // Joy Harjo
  {
    text: 'I think the world will keep coming back with stories we need to tell about it.',
    attribution: 'Joy Harjo',
  },
  {
    text: 'Remember the sky that you were born under, know each of the star\'s stories.',
    attribution: 'Joy Harjo',
  },
  {
    text: 'Nothing is ever lost in poetry. It stays with you forever.',
    attribution: 'Joy Harjo',
  },

  // LaDonna Harris
  {
    text: 'We have always been people who got up in the morning and made things happen.',
    attribution: 'LaDonna Harris',
  },

  // Zitkala-Ša
  {
    text: 'I was not wholly conscious of myself, but was more keenly alive to the fire within.',
    attribution: 'Zitkala-Ša',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OTHER WOMEN OF COLOR — Latina
  // ═══════════════════════════════════════════════════════════════════════════

  // Dolores Huerta
  {
    text: 'Every moment is an organizing opportunity, every person a potential activist, every minute a chance to change the world.',
    attribution: 'Dolores Huerta',
  },
  {
    text: 'Walk the street with us into history. Get off the sidewalk.',
    attribution: 'Dolores Huerta',
  },
  {
    text: 'We can\'t let people drive wedges between us, because there\'s only one human race.',
    attribution: 'Dolores Huerta',
  },
  {
    text: 'If you haven\'t forgiven yourself something, how can you forgive others?',
    attribution: 'Dolores Huerta',
  },

  // Gloria Anzaldúa
  {
    text: 'I change myself, I change the world.',
    attribution: 'Gloria Anzaldúa',
  },
  {
    text: 'Bridges are thresholds to other realities, archetypal, primal symbols of shifting consciousness.',
    attribution: 'Gloria Anzaldúa',
  },
  {
    text: 'I will not be shamed again, nor will I shame myself.',
    attribution: 'Gloria Anzaldúa',
  },
  {
    text: 'Nothing happens in the real world unless it first happens in the images in our heads.',
    attribution: 'Gloria Anzaldúa',
  },

  // Sandra Cisneros
  {
    text: 'I am the one nobody knows about, the one who lives on the edge of things.',
    attribution: 'Sandra Cisneros',
  },
  {
    text: 'I am a woman and I am a Latina. Those are the things that make my writing distinctive.',
    attribution: 'Sandra Cisneros',
  },

  // Sonia Sotomayor
  {
    text: 'I have never had to face anything that could overwhelm the native optimism and stubborn perseverance I was blessed with.',
    attribution: 'Sonia Sotomayor',
  },
  {
    text: 'Experience has taught me that you cannot value dreams according to the odds of their coming true.',
    attribution: 'Sonia Sotomayor',
  },

  // Julia Alvarez
  {
    text: 'Each of us has our own special gift, and in the unfolding of that gift lies the meaning and purpose of life.',
    attribution: 'Julia Alvarez',
  },

  // Sylvia Rivera
  {
    text: 'I\'m not missing a minute of this. It\'s the revolution!',
    attribution: 'Sylvia Rivera',
  },
  {
    text: 'If you don\'t fight for what you believe in, no one else is going to fight for you.',
    attribution: 'Sylvia Rivera',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OTHER WOMEN OF COLOR — Asian / Pacific Islander
  // ═══════════════════════════════════════════════════════════════════════════

  // Yuri Kochiyama
  {
    text: 'Life is not what you alone make it. Life is the input of everyone who touched your life and every experience that entered it.',
    attribution: 'Yuri Kochiyama',
  },
  {
    text: 'Tomorrow\'s world is yours to build.',
    attribution: 'Yuri Kochiyama',
  },
  {
    text: 'Remember that consciousness is power.',
    attribution: 'Yuri Kochiyama',
  },
  {
    text: 'People have to understand their own power.',
    attribution: 'Yuri Kochiyama',
  },

  // Grace Lee Boggs
  {
    text: 'We have to change ourselves in order to change the world.',
    attribution: 'Grace Lee Boggs',
  },
  {
    text: 'You cannot change any society unless you take responsibility for it, unless you see yourself as belonging to it.',
    attribution: 'Grace Lee Boggs',
  },
  {
    text: 'Transform yourself to transform the world.',
    attribution: 'Grace Lee Boggs',
  },
  {
    text: 'The most radical thing I ever did was to stay put.',
    attribution: 'Grace Lee Boggs',
  },
  {
    text: 'Building community is to the collective as spiritual practice is to the individual.',
    attribution: 'Grace Lee Boggs',
  },

  // Arundhati Roy
  {
    text: 'Another world is not only possible, she is on her way. On a quiet day, I can hear her breathing.',
    attribution: 'Arundhati Roy',
  },
  {
    text: 'There\'s really no such thing as the voiceless. There are only the deliberately silenced, or the preferably unheard.',
    attribution: 'Arundhati Roy',
  },
  {
    text: 'The trouble is that once you see it, you can\'t unsee it. And once you\'ve seen it, keeping quiet, saying nothing, becomes as political an act as speaking out.',
    attribution: 'Arundhati Roy',
  },
  {
    text: 'To love. To be loved. To never forget your own insignificance.',
    attribution: 'Arundhati Roy',
  },

  // Maxine Hong Kingston
  {
    text: 'In a time of destruction, create something.',
    attribution: 'Maxine Hong Kingston',
  },

  // Naomi Osaka
  {
    text: 'It\'s OK to not be OK. It\'s OK to talk about it.',
    attribution: 'Naomi Osaka',
  },

  // Amanda Nguyen
  {
    text: 'You don\'t need permission to change the world.',
    attribution: 'Amanda Nguyen',
  },
  {
    text: 'When people tell you something is impossible, what they really mean is that they don\'t know how to do it.',
    attribution: 'Amanda Nguyen',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // BLACK MEN
  // ═══════════════════════════════════════════════════════════════════════════

  // James Baldwin
  {
    text: 'Not everything that is faced can be changed, but nothing can be changed until it is faced.',
    attribution: 'James Baldwin',
  },
  {
    text: 'The place in which I\'ll fit will not exist until I make it.',
    attribution: 'James Baldwin',
  },
  {
    text: 'Love takes off masks that we fear we cannot live without and know we cannot live within.',
    attribution: 'James Baldwin',
  },
  {
    text: 'People are trapped in history, and history is trapped in them.',
    attribution: 'James Baldwin',
  },
  {
    text: 'Children have never been very good at listening to their elders, but they have never failed to imitate them.',
    attribution: 'James Baldwin',
  },
  {
    text: 'You think your pain and your heartbreak are unprecedented in the history of the world, but then you read.',
    attribution: 'James Baldwin',
  },
  {
    text: 'The paradox of education is precisely this: that as one begins to become conscious one begins to examine the society in which one is being educated.',
    attribution: 'James Baldwin',
  },
  {
    text: 'I love America more than any other country in the world, and, exactly for this reason, I insist on the right to criticize her perpetually.',
    attribution: 'James Baldwin',
  },

  // Langston Hughes
  {
    text: 'Hold fast to dreams, for if dreams die, life is a broken-winged bird that cannot fly.',
    attribution: 'Langston Hughes',
  },
  {
    text: 'I, too, sing America.',
    attribution: 'Langston Hughes',
  },
  {
    text: 'Life is for the living. Death is for the dead. Let life be like music. And death a note unsaid.',
    attribution: 'Langston Hughes',
  },
  {
    text: 'Let the rain sing you a lullaby.',
    attribution: 'Langston Hughes',
  },
  {
    text: 'I have discovered in life that there are ways of getting almost anywhere you want to go, if you really want to go.',
    attribution: 'Langston Hughes',
  },

  // W.E.B. Du Bois
  {
    text: 'The cost of liberty is less than the price of repression.',
    attribution: 'W.E.B. Du Bois',
  },
  {
    text: 'Children learn more from what you are than what you teach.',
    attribution: 'W.E.B. Du Bois',
  },
  {
    text: 'There is in this world no such force as the force of a person determined to rise.',
    attribution: 'W.E.B. Du Bois',
  },
  {
    text: 'Believe in life! Always human beings will progress to greater, broader, and fuller life.',
    attribution: 'W.E.B. Du Bois',
  },
  {
    text: 'Now is the accepted time, not tomorrow, not some more convenient season.',
    attribution: 'W.E.B. Du Bois',
  },

  // Frederick Douglass
  {
    text: 'If there is no struggle, there is no progress.',
    attribution: 'Frederick Douglass',
  },
  {
    text: 'It is easier to build strong children than to repair broken men.',
    attribution: 'Frederick Douglass',
  },
  {
    text: 'Once you learn to read, you will be forever free.',
    attribution: 'Frederick Douglass',
  },
  {
    text: 'Power concedes nothing without a demand. It never did and it never will.',
    attribution: 'Frederick Douglass',
  },
  {
    text: 'I prayed for freedom for twenty years, but received no answer until I prayed with my legs.',
    attribution: 'Frederick Douglass',
  },

  // Martin Luther King Jr.
  {
    text: 'Injustice anywhere is a threat to justice everywhere.',
    attribution: 'Martin Luther King Jr.',
  },
  {
    text: 'The time is always right to do what is right.',
    attribution: 'Martin Luther King Jr.',
  },
  {
    text: 'Darkness cannot drive out darkness; only light can do that. Hate cannot drive out hate; only love can do that.',
    attribution: 'Martin Luther King Jr.',
  },
  {
    text: 'Life\'s most persistent and urgent question is: What are you doing for others?',
    attribution: 'Martin Luther King Jr.',
  },
  {
    text: 'The ultimate measure of a man is not where he stands in moments of comfort and convenience, but where he stands at times of challenge and controversy.',
    attribution: 'Martin Luther King Jr.',
  },
  {
    text: 'Our lives begin to end the day we become silent about things that matter.',
    attribution: 'Martin Luther King Jr.',
  },
  {
    text: 'Faith is taking the first step even when you don\'t see the whole staircase.',
    attribution: 'Martin Luther King Jr.',
  },
  {
    text: 'Love is the only force capable of transforming an enemy into a friend.',
    attribution: 'Martin Luther King Jr.',
  },

  // Malcolm X
  {
    text: 'Education is the passport to the future, for tomorrow belongs to those who prepare for it today.',
    attribution: 'Malcolm X',
  },
  {
    text: 'If you don\'t stand for something you will fall for anything.',
    attribution: 'Malcolm X',
  },
  {
    text: 'You can\'t separate peace from freedom because no one can be at peace unless he has his freedom.',
    attribution: 'Malcolm X',
  },
  {
    text: 'I believe in human beings, and that all human beings should be respected as such, regardless of their color.',
    attribution: 'Malcolm X',
  },

  // Cornel West
  {
    text: 'Justice is what love looks like in public.',
    attribution: 'Cornel West',
  },
  {
    text: 'You can\'t lead the people if you don\'t love the people. You can\'t save the people if you don\'t serve the people.',
    attribution: 'Cornel West',
  },
  {
    text: 'Empathy is not simply a matter of trying to imagine what others are going through, but having the will to muster enough courage to do something about it.',
    attribution: 'Cornel West',
  },

  // Ta-Nehisi Coates
  {
    text: 'The dream thrives on generalization, on limiting the number of possible questions, on privileging immediate answers.',
    attribution: 'Ta-Nehisi Coates',
  },
  {
    text: 'Struggle is really all I have. Struggle, and the ability to feel that you are struggling.',
    attribution: 'Ta-Nehisi Coates',
  },

  // Bryan Stevenson
  {
    text: 'Each of us is more than the worst thing we\'ve ever done.',
    attribution: 'Bryan Stevenson',
  },
  {
    text: 'The opposite of poverty is not wealth; the opposite of poverty is justice.',
    attribution: 'Bryan Stevenson',
  },
  {
    text: 'Hopelessness is the enemy of justice.',
    attribution: 'Bryan Stevenson',
  },
  {
    text: 'We are all implicated when we allow other people to be mistreated.',
    attribution: 'Bryan Stevenson',
  },
  {
    text: 'You can\'t understand most of the important things from a distance. You have to get close.',
    attribution: 'Bryan Stevenson',
  },

  // Bayard Rustin
  {
    text: 'We need, in every community, a group of angelic troublemakers.',
    attribution: 'Bayard Rustin',
  },
  {
    text: 'The proof that one truly believes is in action.',
    attribution: 'Bayard Rustin',
  },
  {
    text: 'If we desire a society of peace, then we cannot achieve such a society through violence.',
    attribution: 'Bayard Rustin',
  },

  // John Lewis
  {
    text: 'When you see something that is not right, not fair, not just, you have to speak up. You have to say something; you have to do something.',
    attribution: 'John Lewis',
  },
  {
    text: 'Do not get lost in a sea of despair. Be hopeful, be optimistic.',
    attribution: 'John Lewis',
  },
  {
    text: 'Never, ever be afraid to make some noise and get in good trouble, necessary trouble.',
    attribution: 'John Lewis',
  },
  {
    text: 'You are a light. You are the light. Never let anyone, any person or any force, dampen, dim, or diminish your light.',
    attribution: 'John Lewis',
  },
  {
    text: 'The vote is the most powerful nonviolent tool we have.',
    attribution: 'John Lewis',
  },

  // Paul Robeson
  {
    text: 'The artist must elect to fight for freedom or slavery. I have made my choice.',
    attribution: 'Paul Robeson',
  },
  {
    text: 'Artists are the gatekeepers of truth.',
    attribution: 'Paul Robeson',
  },
  {
    text: 'The answer to injustice is not to silence the critic, but to end the injustice.',
    attribution: 'Paul Robeson',
  },

  // Kwame Nkrumah
  {
    text: 'It is far better to be free to govern or misgovern yourself than to be governed by anybody else.',
    attribution: 'Kwame Nkrumah',
  },
  {
    text: 'We face neither East nor West; we face forward.',
    attribution: 'Kwame Nkrumah',
  },

  // Nelson Mandela
  {
    text: 'Education is the most powerful weapon which you can use to change the world.',
    attribution: 'Nelson Mandela',
  },
  {
    text: 'It always seems impossible until it\'s done.',
    attribution: 'Nelson Mandela',
  },
  {
    text: 'I learned that courage was not the absence of fear, but the triumph over it.',
    attribution: 'Nelson Mandela',
  },
  {
    text: 'What counts in life is not the mere fact that we have lived. It is what difference we have made to the lives of others.',
    attribution: 'Nelson Mandela',
  },
  {
    text: 'A winner is a dreamer who never gives up.',
    attribution: 'Nelson Mandela',
  },
  {
    text: 'There is no passion to be found playing small, in settling for a life that is less than the one you are capable of living.',
    attribution: 'Nelson Mandela',
  },
  {
    text: 'May your choices reflect your hopes, not your fears.',
    attribution: 'Nelson Mandela',
  },

  // Desmond Tutu
  {
    text: 'If you are neutral in situations of injustice, you have chosen the side of the oppressor.',
    attribution: 'Desmond Tutu',
  },
  {
    text: 'Do your little bit of good where you are; it\'s those little bits of good put together that overwhelm the world.',
    attribution: 'Desmond Tutu',
  },
  {
    text: 'My humanity is bound up in yours, for we can only be human together.',
    attribution: 'Desmond Tutu',
  },
  {
    text: 'Hope is being able to see that there is light despite all of the darkness.',
    attribution: 'Desmond Tutu',
  },

  // Steve Biko
  {
    text: 'The most potent weapon in the hands of the oppressor is the mind of the oppressed.',
    attribution: 'Steve Biko',
  },
  {
    text: 'I write what I like.',
    attribution: 'Steve Biko',
  },

  // Claude McKay
  {
    text: 'If we must die, let it not be like hogs hunted and penned in an inglorious spot.',
    attribution: 'Claude McKay',
  },

  // Ralph Ellison
  {
    text: 'I am invisible, understand, simply because people refuse to see me.',
    attribution: 'Ralph Ellison',
  },
  {
    text: 'When I discover who I am, I\'ll be free.',
    attribution: 'Ralph Ellison',
  },
  {
    text: 'Life is to be lived, not controlled; and humanity is won by continuing to play in face of certain defeat.',
    attribution: 'Ralph Ellison',
  },

  // Richard Wright
  {
    text: 'Men can starve from a lack of self-realization as much as they can from a lack of bread.',
    attribution: 'Richard Wright',
  },

  // Amiri Baraka
  {
    text: 'Art is whatever makes you proud to be human.',
    attribution: 'Amiri Baraka',
  },
  {
    text: 'A man is either free or he is not. There cannot be any apprenticeship for freedom.',
    attribution: 'Amiri Baraka',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WISDOM TRADITIONS — African Proverbs
  // ═══════════════════════════════════════════════════════════════════════════
  {
    text: 'If you want to go fast, go alone. If you want to go far, go together.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'It takes a village to raise a child.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'When there is no enemy within, the enemies outside cannot hurt you.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'A single bracelet does not jingle.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'Knowledge is like a garden; if it is not cultivated, it cannot be harvested.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'The child who is not embraced by the village will burn it down to feel its warmth.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'Smooth seas do not make skillful sailors.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'However long the night, the dawn will break.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'Unity is strength, division is weakness.',
    attribution: 'Swahili Proverb',
    tradition: 'Swahili Proverb',
  },
  {
    text: 'Where you will sit when you are old shows where you stood in youth.',
    attribution: 'Yoruba Proverb',
    tradition: 'Yoruba Proverb',
  },
  {
    text: 'The earth is not inherited from our parents; it is borrowed from our children.',
    attribution: 'Akan Proverb',
    tradition: 'Akan Proverb',
  },
  {
    text: 'A tree cannot stand without its roots.',
    attribution: 'Zulu Proverb',
    tradition: 'Zulu Proverb',
  },
  {
    text: 'When the music changes, so does the dance.',
    attribution: 'Igbo Proverb',
    tradition: 'Igbo Proverb',
  },
  {
    text: 'By trying often, the monkey learns to jump from the tree.',
    attribution: 'Ashanti Proverb',
    tradition: 'Ashanti Proverb',
  },
  {
    text: 'Wisdom does not come overnight.',
    attribution: 'Swahili Proverb',
    tradition: 'Swahili Proverb',
  },
  {
    text: 'When elephants fight, it is the grass that suffers.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'Do not look where you fell, but where you slipped.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'The wise create proverbs for fools to learn, not to repeat.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'He who learns, teaches.',
    attribution: 'Ethiopian Proverb',
    tradition: 'Ethiopian Proverb',
  },
  {
    text: 'One who plants a tree plants a hope.',
    attribution: 'Yoruba Proverb',
    tradition: 'Yoruba Proverb',
  },
  {
    text: 'Return to old watering holes for more than water; friends and dreams are there to meet you.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'If you close your eyes to facts, you will learn through accidents.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'Sticks in a bundle are unbreakable.',
    attribution: 'Maasai Proverb',
    tradition: 'Maasai Proverb',
  },
  {
    text: 'Wisdom is wealth.',
    attribution: 'Swahili Proverb',
    tradition: 'Swahili Proverb',
  },
  {
    text: 'No matter how long the winter, spring is sure to follow.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'The one who asks questions doesn\'t lose their way.',
    attribution: 'Akan Proverb',
    tradition: 'Akan Proverb',
  },
  {
    text: 'A river cuts through a rock not because of its power but its persistence.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'Until lions have their own historians, tales of the hunt shall always glorify the hunter.',
    attribution: 'Igbo Proverb',
    tradition: 'Igbo Proverb',
  },
  {
    text: 'The best time to plant a tree was twenty years ago. The second-best time is now.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },
  {
    text: 'Every closed eye is not sleeping, and every open eye is not seeing.',
    attribution: 'African Proverb',
    tradition: 'African Proverb',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WISDOM TRADITIONS — Indigenous Wisdom
  // ═══════════════════════════════════════════════════════════════════════════
  {
    text: 'We do not inherit the earth from our ancestors; we borrow it from our children.',
    attribution: 'Indigenous Wisdom',
    tradition: 'Indigenous Wisdom',
  },
  {
    text: 'Tell me and I\'ll forget. Show me, and I may not remember. Involve me, and I\'ll understand.',
    attribution: 'Lakota Wisdom',
    tradition: 'Lakota Wisdom',
  },
  {
    text: 'When you were born, you cried and the world rejoiced. Live your life so that when you die, the world cries and you rejoice.',
    attribution: 'Cherokee Wisdom',
    tradition: 'Cherokee Wisdom',
  },
  {
    text: 'What is life? It is the flash of a firefly in the night.',
    attribution: 'Blackfoot Wisdom',
    tradition: 'Blackfoot Wisdom',
  },
  {
    text: 'Walk lightly in the spring; mother earth is pregnant.',
    attribution: 'Hopi Wisdom',
    tradition: 'Hopi Wisdom',
  },
  {
    text: 'All things are connected. Whatever befalls the earth befalls the children of the earth.',
    attribution: 'Indigenous Wisdom',
    tradition: 'Indigenous Wisdom',
  },
  {
    text: 'With all things and in all things, we are relatives.',
    attribution: 'Lakota Wisdom',
    tradition: 'Lakota Wisdom',
  },
  {
    text: 'The ground on which we stand is sacred ground. It is the blood of our ancestors.',
    attribution: 'Nez Perce Wisdom',
    tradition: 'Nez Perce Wisdom',
  },
  {
    text: 'Don\'t be afraid to cry. It will free your mind of sorrowful thoughts.',
    attribution: 'Hopi Wisdom',
    tradition: 'Hopi Wisdom',
  },
  {
    text: 'Treat the earth well. It was not given to you by your parents; it was loaned to you by your children.',
    attribution: 'Cree Wisdom',
    tradition: 'Cree Wisdom',
  },
  {
    text: 'Listen to the wind, it talks. Listen to the silence, it speaks. Listen to your heart, it knows.',
    attribution: 'Navajo Wisdom',
    tradition: 'Navajo Wisdom',
  },
  {
    text: 'A brave man dies but once; a coward many times.',
    attribution: 'Ojibwe Wisdom',
    tradition: 'Ojibwe Wisdom',
  },
  {
    text: 'It is no longer good enough to cry peace. We must act peace, live peace, and march in peace.',
    attribution: 'Shenandoah Wisdom',
    tradition: 'Shenandoah Wisdom',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WISDOM TRADITIONS — Buddhist / Hindu / Sufi
  // ═══════════════════════════════════════════════════════════════════════════
  {
    text: 'You yourself, as much as anybody in the entire universe, deserve your love and affection.',
    attribution: 'Buddhist Wisdom',
    tradition: 'Buddhist Wisdom',
  },
  {
    text: 'An idea that is developed and put into action is more important than an idea that exists only as an idea.',
    attribution: 'Buddhist Wisdom',
    tradition: 'Buddhist Wisdom',
  },
  {
    text: 'In the confrontation between the stream and the rock, the stream always wins, not through strength, but through persistence.',
    attribution: 'Buddhist Wisdom',
    tradition: 'Buddhist Wisdom',
  },
  {
    text: 'What you are is what you have been. What you\'ll be is what you do now.',
    attribution: 'Buddhist Wisdom',
    tradition: 'Buddhist Wisdom',
  },
  {
    text: 'No one saves us but ourselves. No one can and no one may. We ourselves must walk the path.',
    attribution: 'Buddhist Wisdom',
    tradition: 'Buddhist Wisdom',
  },
  {
    text: 'Peace does not mean an absence of conflicts; differences will always be there.',
    attribution: 'Buddhist Wisdom',
    tradition: 'Buddhist Wisdom',
  },
  {
    text: 'Be kind, for everyone you meet is fighting a hard battle.',
    attribution: 'Buddhist Wisdom',
    tradition: 'Buddhist Wisdom',
  },
  {
    text: 'The wound is the place where the light enters you.',
    attribution: 'Rumi',
    tradition: 'Sufi Wisdom',
  },
  {
    text: 'Let yourself be silently drawn by the strange pull of what you really love. It will not lead you astray.',
    attribution: 'Rumi',
    tradition: 'Sufi Wisdom',
  },
  {
    text: 'Yesterday I was clever, so I wanted to change the world. Today I am wise, so I am changing myself.',
    attribution: 'Rumi',
    tradition: 'Sufi Wisdom',
  },
  {
    text: 'Raise your words, not your voice. It is rain that grows flowers, not thunder.',
    attribution: 'Rumi',
    tradition: 'Sufi Wisdom',
  },
  {
    text: 'Sit with those who speak to your heart, not those who numb your soul.',
    attribution: 'Sufi Wisdom',
    tradition: 'Sufi Wisdom',
  },
  {
    text: 'Be the change you wish to see in the world.',
    attribution: 'Hindu Wisdom',
    tradition: 'Hindu Wisdom',
  },
  {
    text: 'When meditation is mastered, the mind is unwavering like the flame of a candle in a windless place.',
    attribution: 'Hindu Wisdom',
    tradition: 'Hindu Wisdom',
  },
  {
    text: 'Where there is love there is life.',
    attribution: 'Hindu Wisdom',
    tradition: 'Hindu Wisdom',
  },
  {
    text: 'We but mirror the world. All the tendencies present in the outer world are to be found in the world of our body.',
    attribution: 'Hindu Wisdom',
    tradition: 'Hindu Wisdom',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // WISDOM TRADITIONS — Latin American / Caribbean
  // ═══════════════════════════════════════════════════════════════════════════
  {
    text: 'Little by little, one walks far.',
    attribution: 'Peruvian Proverb',
    tradition: 'Latin American Wisdom',
  },
  {
    text: 'Tell me who your friends are, and I\'ll tell you who you are.',
    attribution: 'Latin American Proverb',
    tradition: 'Latin American Wisdom',
  },
  {
    text: 'From the errors of others, a wise man corrects his own.',
    attribution: 'Latin American Proverb',
    tradition: 'Latin American Wisdom',
  },
  {
    text: 'He who does not look ahead remains behind.',
    attribution: 'Caribbean Proverb',
    tradition: 'Caribbean Wisdom',
  },
  {
    text: 'Water that does not flow becomes stagnant.',
    attribution: 'Caribbean Proverb',
    tradition: 'Caribbean Wisdom',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // ADDITIONAL BLACK WOMEN — Deepening Representation
  // ═══════════════════════════════════════════════════════════════════════════

  // Additional Toni Morrison
  {
    text: 'Love is or it ain\'t. Thin love ain\'t love at all.',
    attribution: 'Toni Morrison',
  },
  {
    text: 'There is really nothing more to say, except why. But since why is difficult to handle, one must take refuge in how.',
    attribution: 'Toni Morrison',
  },

  // Additional Maya Angelou
  {
    text: 'We are more alike, my friends, than we are unalike.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'If one is lucky, a solitary fantasy can totally transform one million realities.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'Life is not measured by the number of breaths we take, but by the moments that take our breath away.',
    attribution: 'Maya Angelou',
  },
  {
    text: 'I respect myself and insist upon it from everybody. And because I do it, I then respect everybody, too.',
    attribution: 'Maya Angelou',
  },

  // Additional Audre Lorde
  {
    text: 'The quality of light by which we scrutinize our lives has direct bearing upon the product which we live, and upon the changes which we hope to bring about.',
    attribution: 'Audre Lorde',
  },
  {
    text: 'Pain is important: how we evade it, how we succumb to it, how we deal with it, how we transcend it.',
    attribution: 'Audre Lorde',
  },

  // Additional bell hooks
  {
    text: 'One of the best guides to how to be self-loving is to give ourselves the love we are often dreaming about receiving from others.',
    attribution: 'bell hooks',
  },
  {
    text: 'The practice of love offers no place of safety. We risk loss, hurt, pain. We risk being acted upon by forces outside our control.',
    attribution: 'bell hooks',
  },

  // Additional Angela Davis
  {
    text: 'We have to talk about liberating minds as well as liberating society.',
    attribution: 'Angela Davis',
  },

  // Additional Fannie Lou Hamer
  {
    text: 'The question for Black people is not, when is the white man going to give us our rights, but, when are we going to take them?',
    attribution: 'Fannie Lou Hamer',
  },

  // Additional Shirley Chisholm
  {
    text: 'The emotional, sexual, and psychological stereotyping of females begins when the doctor says: It\'s a girl.',
    attribution: 'Shirley Chisholm',
  },

  // Additional Oprah Winfrey
  {
    text: 'Think like a queen. A queen is not afraid to fail. Failure is another stepping stone to greatness.',
    attribution: 'Oprah Winfrey',
  },
  {
    text: 'Surround yourself with only people who are going to lift you higher.',
    attribution: 'Oprah Winfrey',
  },

  // Additional Michelle Obama
  {
    text: 'There is no magic to achievement. It\'s really about hard work, choices, and persistence.',
    attribution: 'Michelle Obama',
  },

  // Additional Octavia Butler
  {
    text: 'Kindness eases change. Love quiets fear.',
    attribution: 'Octavia Butler',
  },

  // Additional Ida B. Wells
  {
    text: 'Eternal vigilance is the price of liberty, and it does seem to me that notwithstanding all these social forces, it is the survey of the survey that we must rely upon.',
    attribution: 'Ida B. Wells',
  },

  // Additional Marian Wright Edelman
  {
    text: 'We must not, in trying to think about how we can make a big difference, ignore the small daily differences we can make.',
    attribution: 'Marian Wright Edelman',
  },

  // Additional Nina Simone
  {
    text: 'There\'s no excuse for the young people not knowing who the heroes and heroines are or were.',
    attribution: 'Nina Simone',
  },

  // Additional Alice Walker
  {
    text: 'Healing begins where the wound was made.',
    attribution: 'Alice Walker',
  },

  // Additional Zora Neale Hurston
  {
    text: 'Love makes your soul crawl out from its hiding place.',
    attribution: 'Zora Neale Hurston',
  },

  // Additional Gwendolyn Brooks
  {
    text: 'Exhaust the little moment. Soon it dies.',
    attribution: 'Gwendolyn Brooks',
  },

  // Additional Nikki Giovanni
  {
    text: 'You must be unintimidated by your own thoughts.',
    attribution: 'Nikki Giovanni',
  },

  // Additional Sonia Sanchez
  {
    text: 'If we are not committed to saving this earth, we will be its victims.',
    attribution: 'Sonia Sanchez',
  },

  // Additional Josephine Baker
  {
    text: 'I believe in prayer. It\'s the best way we have to draw strength from heaven.',
    attribution: 'Josephine Baker',
  },

  // Additional Dorothy Height
  {
    text: 'Without community service, we would not have a strong quality of life. It\'s important to the person who serves as well as the recipient.',
    attribution: 'Dorothy Height',
  },

  // Additional Viola Davis
  {
    text: 'I believe that the privilege of a lifetime is being who you are.',
    attribution: 'Viola Davis',
  },

  // Additional Amanda Gorman
  {
    text: 'We are striving to forge a union with purpose.',
    attribution: 'Amanda Gorman',
  },

  // Additional Stacey Abrams
  {
    text: 'Being told no doesn\'t mean you stop. It means you change your approach.',
    attribution: 'Stacey Abrams',
  },

  // Additional Coretta Scott King
  {
    text: 'Women, if the soul of the nation is to be saved, I believe that you must become its soul.',
    attribution: 'Coretta Scott King',
  },

  // Additional Mary McLeod Bethune
  {
    text: 'We have a powerful potential in our youth, and we must have the courage to change old ideas and practices so that we may direct their power toward good ends.',
    attribution: 'Mary McLeod Bethune',
  },

  // Additional Barbara Jordan
  {
    text: 'Think what a better world it would be if we all, the whole world, had cookies and milk about three o\'clock every afternoon and then lay down with our blankies for a nap.',
    attribution: 'Barbara Jordan',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // OTHER VOICES
  // ═══════════════════════════════════════════════════════════════════════════

  // Paulo Freire
  {
    text: 'Education either functions as an instrument to bring about conformity or it becomes the practice of freedom.',
    attribution: 'Paulo Freire',
  },
  {
    text: 'Washing one\'s hands of the conflict between the powerful and the powerless means to side with the powerful.',
    attribution: 'Paulo Freire',
  },
  {
    text: 'No one is born fully formed: it is through self-experience in the world that we become what we are.',
    attribution: 'Paulo Freire',
  },
  {
    text: 'Looking at the past must only be a means of understanding more clearly what and who they are so that they can more wisely build the future.',
    attribution: 'Paulo Freire',
  },
  {
    text: 'To speak a true word is to transform the world.',
    attribution: 'Paulo Freire',
  },
  {
    text: 'Reading the world always precedes reading the word.',
    attribution: 'Paulo Freire',
  },

  // Václav Havel
  {
    text: 'Hope is not the conviction that something will turn out well, but the certainty that something makes sense, regardless of how it turns out.',
    attribution: 'Václav Havel',
  },
  {
    text: 'The salvation of this human world lies nowhere else than in the human heart.',
    attribution: 'Václav Havel',
  },

  // Albert Einstein
  {
    text: 'The world as we have created it is a process of our thinking. It cannot be changed without changing our thinking.',
    attribution: 'Albert Einstein',
  },
  {
    text: 'Imagination is more important than knowledge.',
    attribution: 'Albert Einstein',
  },
  {
    text: 'In the middle of difficulty lies opportunity.',
    attribution: 'Albert Einstein',
  },
  {
    text: 'Strive not to be a success, but rather to be of value.',
    attribution: 'Albert Einstein',
  },

  // Gandhi
  {
    text: 'In a gentle way, you can shake the world.',
    attribution: 'Mahatma Gandhi',
  },
  {
    text: 'The best way to find yourself is to lose yourself in the service of others.',
    attribution: 'Mahatma Gandhi',
  },
  {
    text: 'Our ability to reach unity in diversity will be the beauty and the test of our civilization.',
    attribution: 'Mahatma Gandhi',
  },

  // Kahlil Gibran
  {
    text: 'Out of suffering have emerged the strongest souls; the most massive characters are seared with scars.',
    attribution: 'Kahlil Gibran',
  },
  {
    text: 'Your children are not your children. They are the sons and daughters of life\'s longing for itself.',
    attribution: 'Kahlil Gibran',
  },
  {
    text: 'To understand the heart and mind of a person, look not at what he has already achieved, but at what he aspires to.',
    attribution: 'Kahlil Gibran',
  },

  // Howard Zinn
  {
    text: 'We don\'t have to engage in grand, heroic actions to participate in change. Small acts, multiplied by millions, can transform the world.',
    attribution: 'Howard Zinn',
  },
  {
    text: 'To be hopeful in bad times is not just foolishly romantic. It is based on the fact that human history is a history not only of cruelty, but also of compassion.',
    attribution: 'Howard Zinn',
  },

  // Noam Chomsky
  {
    text: 'If you assume that there is no hope, you guarantee that there will be no hope.',
    attribution: 'Noam Chomsky',
  },
  {
    text: 'Optimism is a strategy for making a better future.',
    attribution: 'Noam Chomsky',
  },

  // Eduardo Galeano
  {
    text: 'Utopia is on the horizon. I walk two steps, she moves two steps farther away. I walk ten steps and the horizon runs ten steps further. So what\'s the point of utopia? The point is this: to keep walking.',
    attribution: 'Eduardo Galeano',
  },
  {
    text: 'Many small people, in many small places, doing many small things, can alter the face of the earth.',
    attribution: 'Eduardo Galeano',
  },

  // Victor Hugo
  {
    text: 'Nothing is more powerful than an idea whose time has come.',
    attribution: 'Victor Hugo',
  },
  {
    text: 'Even the darkest night will end and the sun will rise.',
    attribution: 'Victor Hugo',
  },

  // Elie Wiesel
  {
    text: 'There may be times when we are powerless to prevent injustice, but there must never be a time when we fail to protest.',
    attribution: 'Elie Wiesel',
  },

  // Eleanor Roosevelt
  {
    text: 'The future belongs to those who believe in the beauty of their dreams.',
    attribution: 'Eleanor Roosevelt',
  },
  {
    text: 'No one can make you feel inferior without your consent.',
    attribution: 'Eleanor Roosevelt',
  },

  // ═══════════════════════════════════════════════════════════════════════════
  // FIELDVOICES ORIGINAL QUOTES
  // ═══════════════════════════════════════════════════════════════════════════
  {
    text: 'Every voice matters. Every story counts. Every person deserves to be heard.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Equity is not just about equal access. It\'s about creating conditions where everyone can thrive.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Listening is the first act of justice.',
    attribution: 'FieldVoices',
  },
  {
    text: 'When we center the voices furthest from power, we build solutions that work for everyone.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Real impact begins with real listening.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Communities don\'t need saviors. They need partners who listen.',
    attribution: 'FieldVoices',
  },
  {
    text: 'The distance between intention and impact is bridged by accountability.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Data tells a story. Make sure it\'s not only your story being told.',
    attribution: 'FieldVoices',
  },
  {
    text: 'The strongest programs are built on the wisdom of those they serve.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Proximity is not the same as presence. Show up, and then show that you\'re there.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Voice without power is noise. Power without voice is tyranny. Together, they are change.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Feedback is a gift. Receiving it with grace is a practice.',
    attribution: 'FieldVoices',
  },
  {
    text: 'The field is where the truth lives. Go there.',
    attribution: 'FieldVoices',
  },
  {
    text: 'If you want to know what a community needs, ask them. Then listen.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Collective action begins with individual courage.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Your lived experience is not anecdotal. It is evidence.',
    attribution: 'FieldVoices',
  },
  {
    text: 'We measure what we value. Make sure you\'re valuing what matters.',
    attribution: 'FieldVoices',
  },
  {
    text: 'The question is not whether people have voices. The question is whether we have the structures to hear them.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Trust is earned in drops and lost in buckets. Handle it with care.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Nothing about us, without us. That\'s not a slogan, it\'s a standard.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Liberation is not a destination. It is a daily practice of choosing justice.',
    attribution: 'FieldVoices',
  },
  {
    text: 'When the people closest to the problem lead the solution, the solution endures.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Empathy without action is just observation.',
    attribution: 'FieldVoices',
  },
  {
    text: 'Speak truth. Seek truth. Build from truth.',
    attribution: 'FieldVoices',
  },
  {
    text: 'The work of equity is not finished when everyone has a seat at the table. It is finished when everyone shapes the table.',
    attribution: 'FieldVoices',
  },
];

/**
 * Returns a random quote on each call.
 */
export function getRandomQuote(): QuoteEntry {
  const index = Math.floor(Math.random() * QUOTES.length);
  return QUOTES[index];
}
