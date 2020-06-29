# Twitch streamer

## Getting Started

### Installation

#### Server 
1. Go to the `server` directory: `cd server` 
2. Install dependencies using `yarn install` or `npm i`
3. Update the ngrok url variable in `config.js` (see more on https://ngrok.com/)
4. Run the app in dev mode `yarn dev` or 
5. Build the app `yarn build` and then `yarn start`

#### Client 
1. Go to the `client` directory: `cd client` 
2. Install dependencies using `yarn install` or `npm i`
3. Run the app: `yarn start`

#### Demo
Visit https://stonks-client.herokuapp.com to play with the app :)

### Available routes

| Method   | Resource                | Description                                                                                                                                 |
| :------- | :---------------------- | :------------------------------------------------------------------------------------------------------------------------------------------ |
| `POST`   | `/webhooks`             | Callback endpoint used by Twitch to send vents                    |
| `PUT`    | `/webhooks`             | Subscribe to events (must receive `?streamer=` (streamer id), `&action=` (subscribe, unsubscribe) and `&type=` (all, follows, follower, streams)                                                               |
| `GET`    | `/webhooks`             | Used by Twitch to verify a subscription                                                                                          |
| `GET`    | `/users/`               | Search for a streamer by username (must receive `?username=`) |
| `GET`    | `/auth/login`           | Returns authenticated user |
| `GET`    | `/auth/logout`          | Log out user |
| `GET`    | `/auth/twitch`          | Twitch login |
| `GET`    | `/auth/twitch/callback` | Twitch auth callback |

### Questions
- How would you deploy the above on AWS? (ideally a rough architecture diagram will help)

To deploy THIS application into AWS I would probably use:

* EC2 instances (if we see an increase in the usage, we can enable auto scaling so it will then automatically scale up or down as needed).
* ELB (Elastic Load Balancer) to handle traffic appropiately
* Route 53 to help with DNS
* CloudWatch for logs and metrics
* Cloudfront will help with assets (we can deploy the react frontend). In can be incredibly fast and is not expensive, providing high availability.

* At this point, we are not using databases so this is why I'm not including them in this architecture.
* We can use Docker as well.

NOTE: Scaling always imply a trade-off. Moreover, things like ELB or auto-scaling do not need to be enabled/added from the go. As long as the application needs more resources, we should add them. This is to prevent overheads and overkills.
Each additional "components/features" imply more logic in the architecture in order to work.

- Where do you see bottlenecks in your proposed architecture and how would you approach scaling this app starting from 100 reqs/day to 900MM reqs/day over 6 months?

The biggest bottleneck is basically that this application is heavily reliant on a third-party API. But this is something we can not avoid if, from inception, the application MUST use this.
It would be advisable to check the API rate limits and, also, get in touch with Twitch support in case there's a need to have a higher limit.

In this sense, something that could be done is to reduce the amount of calls we do to Twitch. For instance, we could store the user's favourite streamer on a database (RDS) so they doesn't have to be searching for it each time.

Other bottleneck of this application is in the websocket. I'm currently using one websocket for all the clients. Using namespaces or rooms could be one way to improve this.

## License

MIT © Federico M. Alconada Verzini
