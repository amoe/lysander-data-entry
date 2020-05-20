Dave  09:15: I'm looking at the event form UI spec and trying to estimate it

Alex  09:16: hi

Dave  09:16: Can you dig up the "Event Form UI Explanation.docx", I will refer to this soon

Alex  09:18: Got it.

Dave  09:28: OK, I think I have a better grasp on it now
Do you have the UI diagram handy

Alex  09:29
sec
09:32
yep

Dave  09:33

So actually although there are 3 columns it looks like there are only 2 real
distinct modes -- column 2 and 3 are both variations on the same event summary
view.

Alex  09:33:  yes

Dave  09:33
Specifically column 3 is the 'pending-move' state of column 2.

Alex  09:34
yes

Dave  09:34
A confusing thing is the top two layers of column 2 and 3.
09:35
2020-05-05-093647_1153x240_scrot.png 
2020-05-05-093647_1153x240_scrot.png



Alex  09:35
Yes - I explained at the time … the images are doing two different things at
once. For purposes of understanding the three columns, imagine that the top two
rows are consistent across

Dave  09:36
So am I right to say that these options will only be visible in event-form mode
(in column 1) in practice?


Alex  09:36

The differences in the top two rows are unrelated to what happens below them!
Confusing, I know - just to save me having to draw lots of columns

09:36
tht wasn’t the answer t your most rescent q

09:39

All three top pairs of rows represent top-level configurations for authoring
events. In column 1, the events refer to an AircraftSortie (which is itself an
Event, within a hierarchy of events: Operation/Sortie/AircraftSortie). In Column
2, the events are linked to a Person, in Column 3 to an Organisation

Dave  09:40
Given that there are 2 interface modes (event-form and events-summary) -- does
this header actually appear in both modes?

Alex  09:40
My plan is to start with authoring AircraftSortie events, but using a form that
can accommodate these other types too. << cont of previous (not answer0

09:41
Yes, they appear in both.

Dave  09:41
OK, that makes no sense to me, because it seems to me that they're only useful
for the first mode (event-form)

09:42
The "Theme" of an event is a property of the event, not the whole event sequence.

Alex  09:45
Pomdering
09:46

As an example … aren’t all the events in a sequence concerning what occurs on an
AircraftSortie, related to that AircraftSortie?

Dave  09:48
It depends on a few things I guess
09:48
On the meaning of 'subject/theme'
09:48
On the fields that an event actually has

Alex  09:49
Well, the fields vary according to the type-of-theme

Dave  09:49
Yes
09:49
Just on a practical level

Alex  09:49
But then those same fields apply to every event in the sequence to which that event can belong. I think

Dave  09:49
Take the screenshot I posted earlier

Alex  09:50
yep

Dave  09:50
I don't understand what those interface widgets can usefully do when used in the
second mode (event-summary).

09:50
Unless they're deactivated and are purely for information?

Alex  09:51
Ah, ok. Yes - deactivated and for info. Sorry, I missed the crucial ‘deactivated’ note!

Dave  09:51
Ok
09:53
The good thing here is that the two parts of the interface could be implemented
more-or-less separately.

09:54
The event-summary-view is the most complicated.

Alex  09:54
Yes

Dave  09:55
I'm not sure that the rules for valid movements based on event "TimeDates" are
clearly defined.

09:55
That's something algorithmic that we'd need to nail down first

Alex  09:55
Sorry, I’m being dense. Can you explain

Dave  09:56
The user may: move an EventSummary into any position in the Sequence that does
not conflict with any point that does not conflict with a DateTime that the
Event in question may have been assigned (i.e.. it may go no higher in the
sequence than an event with a DateTime later than its own, and no lower in the
list than an event with a DateTime that is earlier than its own.

09:58
We will be using partial date representations.
09:58
So we need to define the rules whereby this works for whatever date representation we are using.

Alex  10:00
OK …

Dave  10:01
sec
10:03
Incidentally I don't see a field for authoring dates
10:03
in column 1
10:03
2020-05-05-100550_171x95_scrot.png 
2020-05-05-100550_171x95_scrot.png


10:04

We have a very specialized concept of dates compared to most web applications so
we won't be able to use an off-the-shelf date picker, we'll likely have to
implement our own

Alex  10:04

The lower of these is intended for authoring dates. The green arrow opens/refers
to a field equivalent to that in green at the bottom of the column, here for
locations

Dave  10:05
oh, I see
10:06
So basically we need to know what the equivalent field looks like, and hence the
rules for date granularity, BEFORE we can know the rules for moving dates
around. (edited) 

10:07
At the simple level we can say "1941" covers 1941-01-01 00:00:00 to 1941-12-31
23:59 and use this rule to discern validity of event moves.

10:07
same for other partial dates
10:08
That should probably be enough to get what we want I suppose

Alex  10:08
Yes, I think so
10:11

Part of the reason that I didn’t include a special panel for DateTime is that it
could get quite complex, if it also represents (as it probably ideally should)
the situation of the event in the sequence: ie no specific DateTime but
“between” X and Y dates. Or ‘before/after’ Z. All this is actually really
important for the modelling of historical dates in general. It’s part of what
Simon and I were grappling with in that JSON LD Time workshop a while ago

Dave  10:12
no specific DateTime but “between” X and Y dates

10:12

This is going to have to be effectively implemented anyway, otherwise the move
rules don't make any sense.

Alex  10:13
Yes. But should it appear in a summary of the DateTime info for an event?

Dave  10:13
probably not

Alex  10:13
And if so, does that imply that it should be editable.

Dave  10:13
not necessarily

Alex  10:13
Right answer - probably not. At least for now
10:13
Ah, ok - maybe a non-editable summary ..

Dave  10:18
The meaning of 'save' is really unclear unfortunately
10:18
Save in what format?  To be loaded how?

Alex  10:21
Right, yes. In my mind, the intention is that the data (graph of data) authored in the form would be, um … not quite ingested to the db but be ready for being so, after moderation …

Dave  10:21
Yes
10:21
That's fine, we can serialize the event to the DB

Alex  10:21
Or would be ingested, but with flags that it was provisional and needed moderation

Dave  10:21
That's a bit of a can of worms though

Alex  10:22
Yes ,,,

Dave  10:22
It will be in a json format when it's being authored in the interface
10:23
These are my task breakdown estimates
10:23
Construct data model for event dates in javascript.  1
Construct fake events with event dates.  0.5
Construct interface listing out events.  0.5
Implement unrestricted event moves.  1
Implement rules to restrict event moves.  3
Implement event grouping.  3
Switch between modes.  2
Date picker widget.  2
Location picker widget.  2
Queries for searching available entities.  3
Defining per-entity search-field & event schema.  1
Save/Load ???

Alex  10:24
Your thoughts on how to handle this? A key consideration, I think, is that the user will want authored data to be available to them to work with as soon as it has been authored. eg you are entering a sequence of events that occur at the same place … you want to be able to put the three created events into a sequence, immediately
10:24
These are JIRA points?

Dave  10:24
yes
10:25
19 points, sprint velocity was in the 14-18 range
10:25
so it's probably about 3 working weeks
10:25
ignoring serialization for now

Alex  10:26
“ignoring serialization for now” - so the saving/loading would be on top of the three weeks, and could be significant?

Dave  10:26
I don't think it's that difficult

Alex  10:27

I just want to throw in one other element that I mentioned before but is not
included in the design. The ability to assign sequences an overall ‘event’ name:
eg ‘Escape from France’ as a sequence-event in a person’s life

Dave  10:28
hmm
10:29
Sort of makes sense
10:29
But are we talking about sequences-of-sequences now? :wink:

Alex  10:29
Yes, but let’s not think about that.

Dave  10:30
OK
10:30

If the feature is just "giving name to event sequences": pretty simple and just
affects the load/save mechanic

10:31

The "event sequences are also first-class events" feature is a lot more
complicated (and also doesn't make sense with the current UI)

10:31
Although I can see it as a potential extension

Alex  10:32
OK, I think it’s fine to leave it like that
10:32
So, my immediate thought is that this work - with a small amount of additional
data ingestion from existing spreadsheets - should be what you spend the 18.5
days on. And as soon as possible, but at your discretion around need to keep
DW/Jeremy sweet.

10:32
However …
10:32
While we’ve been discussing this, I’ve just heard that I haven’t been furloughed

10:34

Which creates more uncertainty in the plan I have in mind for taking Lysander
forward. I need to discuss with Christ at 11 but that probably won’t bring
complete resolution/clarity. I strongly suspect that this work is what will need
to be prioritise anyway but wait until I confirm that before initiating DW
discussions

Dave  10:34
OK

Alex  10:35

If we do proceed with this as priority, though, can I ask what you will be
presenting as your preferred schedule, in relation to eg CASM. ie by when would
you plan to fit in those three weeks?

Dave  10:36
It depends on how soon I can get done with ACLED
10:36
Optimistically I could be done by today
10:36
Not sure though

Alex  10:36
And you’d then intend to begin straight away? (edited) 

Dave  10:38
I'd take 1 day to cover some miscellaneous shl stuff

Alex  10:39
ok. thanks. I’ll get back to you asap

Alex  12:33
After conversation with Chris, I’m not sure that there’s going to be confirmation of the wider picture for a while. I’m taking the view that it’s important and a priority to get this piece of work done, for the reasons discussed.
12:33
How to present to DW. Me or your first, or both at same time? (edited) 

Dave  12:36
Put it in the existing group DM
:+1:
1


Alex  12:37
I’ll wait till DW visible on here again, then will do
