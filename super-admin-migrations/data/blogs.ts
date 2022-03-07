import { Types } from 'mongoose';

export const Blogs = [
    {
        _id: new Types.ObjectId('603dd88e4bb5990dec1f13a9'),
        status: true,
        title: 'Symptom Timeline',
        content:
            '<span><span><span><img src="https://lh5.googleusercontent.com/9-L6P_3b-8dqSZp91HI0dSA1L6-3TY4jkvSwrzrec0yncC-GCaQWATn7CJe31pwsBB7oAMlW5vTqq0PvQwCIpjsxi5yMxnsGZ3S3gd0tPQ94gW9yTj8AJdHg1AUfAyhmaB6Ee-Z1" width="624" height="355"></span></span></span><div><span><span><span><img src="https://lh5.googleusercontent.com/FWpPjbhfmMiEacLYs7Rh64y8F_chPYXSe-dGXZHkZvUXld8aDkGvJpu8utkaxdUtUA2uauh-YB_6MKvkqxqMx0G-ES9yuEn9DsnA2SzGQoHK1i8DUZHq5-_XNYNjRdtC7G0XbomO" width="624" height="80"></span></span></span><span><span><span><br></span></span></span></div>',
        url: 'Symptom-Timeline',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9')
    },
    {
        _id: new Types.ObjectId('603dd8c44bb5990dec1f13aa'),
        status: true,
        title: 'Example Questions',
        content:
            '<span><p dir="ltr"><span><b>Case Manager</b></span></p><p dir="ltr"><span>Steps: Introduce, Inform, Identify Contacts, Isolate, Initiate Contact Tracing, Schedule Followup</span></p><p dir="ltr"><span><b>Step 1: Greeting&#160;</b></span></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>My name is John with the Austin Urban League organization. Is this Steve?</span></p></li></ul><p dir="ltr"><span><b>Step 2: Inform</b></span></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>I have some sensitive information to share. Before we begin, can I verify your name (and birthdate)?&#160;</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Everything we talk about is completely confidential. I&#8217;m calling about your COVID-19 test.</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Have you spoken to your doctor yet?</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>I want to see how you are, and to help keep you and your family and community safe whether you were able to isolate yourself from your family.</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Is this a good time to call?</span></p></li></ul><p dir="ltr"><span>***During the call listen to see if the person is having trouble speaking or breathing, sounds confused by what you&#8217;re saying, or complains of chest pain. If so, pause and contact your supervisor to see if you need to call 911.***</span></p><p dir="ltr"><span><b>Step 3: Symptoms</b></span></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>What symptoms are you experiencing?</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>When did they start?</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Did you have a fever and did medication help it go away?</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>How do you feel now?</span></p></li></ul><p dir="ltr"><span>***If they didn&#8217;t have symptoms, ask when they were tested.</span></p><p dir="ltr"><span><b>Step 4: Resources</b></span></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Gather the list of contacts especially if they live with or work with the person, have been within 6 feet for more than 15 minutes, possibly shared body fluid mouth to mouth.&#160;&#160;</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Explain how and why isolation is important, and help them make an isolation plan.&#160;</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Present the city&#8217;s isolation/quarantine resources (food, shelter). Make sure they make arrangements for meds.&#160;</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>If they need to be around people, stress the need for a mask.&#160;</span></p></li></ul><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Ask about mental health needs or responsibilities, for themselves or others.&#160;</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Make a followup appointment.</span></p></li></ul><div><span><p dir="ltr"><span><b>Contact Tracing&#160;</b></span></p><p dir="ltr"><span><b>Step 1: Greeting&#160;</b></span></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>My name is John with the Austin Urban League organization. Is this Steve?</span></p></li></ul><p dir="ltr"><span><b>Step 2: Inform</b></span></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>I have some sensitive information to share. Before we begin, can I verify your name (and birthdate)?&#160;</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Everything we talk about is completely confidential. I&#8217;m calling about your COVID-19 test.</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Have you spoken to your doctor yet?</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>I want to see how you are, and to help keep you and your family and community safe whether you were able to isolate yourself from your family.</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Is this a good time to call?</span></p></li></ul><p dir="ltr"><span>***During the call listen to see if the person is having trouble speaking or breathing, sounds confused by what you&#8217;re saying, or complains of chest pain. If so, pause and contact your supervisor to see if you need to call 911.***</span></p><p dir="ltr"><span><b>Step 3: Initiate Contact Tracing</b></span></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Inform them they were in close contact with someone testing positive for COVID-19.</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Check for symptoms</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Explain and encourage quarantine. Explain how and why isolation is important, and help them make an isolation plan.&#160;</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Present the city&#8217;s isolation/quarantine resources (food, shelter). Make sure they make arrangements for meds.&#160;</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Identify challenges.</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>If they need to be around people, stress the need for a mask.&#160;</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Answer all questions</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Make a followup call appointment.</span></p></li></ul><br><p dir="ltr"><span><b>FOLLOW UPS</b></span><span> - 7 days after initial call</span></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Cases</span></p></li><ul><li dir="ltr" aria-level="2"><p dir="ltr" role="presentation"><span>Are symptoms still present? If so are they worse or getting better.</span></p></li><li dir="ltr" aria-level="2"><p dir="ltr" role="presentation"><span>Any contact with more people?</span></p></li><li dir="ltr" aria-level="2"><p dir="ltr" role="presentation"><span>Encourage continued isolation for 14 days total. Quarantine - 10 days total UNLESS symptoms crop up.</span></p></li></ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Contacts</span></p></li><ul><li dir="ltr" aria-level="2"><p dir="ltr" role="presentation"><span>Are they seeing symptoms? If so, help them get tested.</span></p></li><li dir="ltr" aria-level="2"><p dir="ltr" role="presentation"><span>Encourage continued quarantine for 10 days total UNLESS symptoms crop up, then they get tested and possibly start a new cycle of isolation with the virus.</span></p></li></ul></ul></span></div></span>',
        url: 'Example-Questions',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9')
    },
    {
        _id: new Types.ObjectId('603dd9184bb5990dec1f13ab'),
        status: true,
        title: 'Active Listening Skills',
        content:
            '<span><p dir="ltr"><span><b>Paraphrasing</b></span><span> - repeating what the other person just said, but in your own words.&#160;&#160;</span></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>What I&#8217;m hearing is&#8230;</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>It sounds like&#8230;</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>You said&#8230;</span></p></li></ul><p dir="ltr"><span>Example:&#160;</span></p><p dir="ltr"><span>Contact says: &#8220;I walked on the beach in the morning but no one was in sight.&#8221;</span></p><p dir="ltr"><span>Contact tracer says: &#8220;What I&#8217;m hearing is you did not run across anyone this morning.&#8221;</span></p><br><p dir="ltr"><span><b>Reflecting</b></span><span> - putting the emotions being reflected at you by the person into words</span></p><p dir="ltr"><span>Example:&#160;</span></p><p dir="ltr"><span>Contact says: &#8220;This contact tracing is too much.&#8221;</span></p><p dir="ltr"><span>Contact tracer says: &#8220;I hear you; this interview process is tiring and overwhelming.&#8221;</span></p><br><p dir="ltr"><span><b>Silence</b></span><span> - Being totally quiet so the other person can finish what they are saying.</span></p><p dir="ltr"><span>Example:&#160;</span></p><p dir="ltr"><span>Contact says: &#8220;I&#8217;m going to have a tough time convincing my family to let me isolate in a hotel.&#160;</span></p><p dir="ltr"><span>Contact tracer says: &#8220;..........&#8221;</span></p><div><span><br></span></div></span>',
        url: 'Active-Listening-Skills',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9')
    },
    {
        _id: new Types.ObjectId('603df6505ecacc096c9417b5'),
        status: true,
        title: 'How COVID-19 Spreads',
        content:
            '<span><p dir="ltr"><span>Current understanding about how the virus that causes COVID&#8209;19 spreads is largely based on what is known about similar coronaviruses.</span></p><p dir="ltr"><span>The virus is thought to spread mainly from person to person:</span></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Between people who are in close contact with one another (within about 6 feet).</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>Through respiratory droplets produced when an infected person coughs or sneezes.</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>These droplets can land in the mouths or noses of people who are nearby or possibly be inhaled into the lungs.</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>COVID&#8209;19 may be spread by people who are not showing any symptoms.</span></p></li></ul><p dir="ltr"><span>The virus may also be spread through surfaces:</span></p><ul><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>By a person touching a surface or object that has a virus on it and then touching their own mouth, nose, or possibly their eyes.</span></p></li><li dir="ltr" aria-level="1"><p dir="ltr" role="presentation"><span>This is not thought to be the main way the virus spreads, but we are still learning more about how this virus spreads.</span></p></li></ul></span>',
        url: 'How-COVID-19-Spreads',
        userId: new Types.ObjectId('60895385b0068f003fe9d0d9')
    }
];
