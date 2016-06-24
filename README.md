# nametag
Nametag is an experiment in creating online safe spaces for sensitive discussion. The project is inspired by offline tactics used by community organizers, and seeks to explore two novel forms of online interaction. At it's core Nametag is a chat platform enhanced by two experimental concepts:

##Norms-based moderation
In offline spaces, it is common for facilitators to state conversations norms that they agree on with the group. All conversations on Nametag have human-readable norms, and all users must agree to them before entering a conversation. If a moderator wishes to take action, she must indicate the norm that she feel someone has violated (or at least should be reminded of). This creates a system of transparency and accountability for moderators, making it easy to have moderator actions (consisting of a comment, a norm that that comment violates, and a rationale) reviewed by third parties. This system of moderator accountability makes it easier to trust more people to be moderators, allowing for a greater diversity of moderated conversation.

##Private, Transportable Reputation
In offline spaces it is common to trust someone in one domain because of trust that they have earned in a related domain. For example, I may trust a lawyer in Detroit because she was a good lawyer in Denver. Unfortunately the architecture of most online systems makes it difficult to "take your trust with you" without third parties colluding to transmit personal data (which quickly becomes problematic.) 

To address this problem Nametag is experimenting with a system of private, shareable reputation. If a user earns trust from a particular community (say, the legal community in Denver) she can receive a certificate from that community (implemented as a double-signed contract on the Ethereum blockchain.) If she approaches a different community, she can choose to share that certificate to earn trust. 

On Nametag this certificate system is implemented in a flexible profiling system. Whenever a user enters a conversation they can choose to drag one or more certificates onto their "nametag", revealing those components of their reputation in that conversation only.

##Implementation
The alpha version of Nametag is implemented in React with Firebase as a backend (though this is expected to change once a suitable open-source event-based solution can be found, sorry Meteor.) Assistance, and code review is appreciated from anyone with experience in React, blockchain technology, community organizing or digital privacy. 

I am reachable on twitter @davidgljay.

