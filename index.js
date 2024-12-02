import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

/*
Challenge:
3. We could improve index.js by moving one line
   of code to a better position. Find it and move it!
*/

const tweetInput = document.getElementById('tweet-input')

for (tweet of tweetsData){
   localStorage.setItem(`nbLikes-${tweet.uuid}`, JSON.stringify(tweet.likes))
   localStorage.setItem(`nbRetweets-${tweet.uuid}`, JSON.stringify(tweet.retweets))
   localStorage.setItem(`nbReplies-${tweet.uuid}`, JSON.stringify(tweet.replies.length))
}


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }else if(e.target.dataset.replybtn){
        handleReplyBtnClick(e.target.dataset.replybtn)
        //console.log(e.target.dataset.replybtn)
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    localStorage.setItem(`nbLikes-${targetTweetObj.uuid}`, JSON.stringify(targetTweetObj.likes))
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    localStorage.setItem(`nbLikes-${targetTweetObj.uuid}`, JSON.stringify(targetTweetObj.retweets))
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    render() 
}

function handleReplyClick(replyId){
    document.getElementById(`replies-${replyId}`).classList.toggle('hidden')
}

function handleReplyBtnClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    const replyInput = document.getElementById(`textearea-${targetTweetObj.uuid}`)
    if(replyInput.value){
        targetTweetObj.replies.unshift({
            handle: `@Scrimba <img src="https://iconape.com/wp-content/files/si/109141/png/twitter-verified-badge.png" style="width:12px;position:relative;top:2px;">`,
            profilePic: `images/scrimbalogo.png`,
            tweetText: `${replyInput.value}`,
        })
    }
    render()
    replyInput.value = ''
    console.log(replyInput)
}

function handleTweetBtnClick(){
/*
Challenge:
1. No empty tweets!
2. Clear the textarea after tweeting!
*/
    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@Scrimba <img src="https://iconape.com/wp-content/files/si/109141/png/twitter-verified-badge.png" style="width:12px;position:relative;top:2px;">`,
        profilePic: `images/scrimbalogo.png`,
        likes: 0,
        retweets: 0,
        tweetText: `${tweetInput.value}`,
        replies: [],
        isLiked: false,
        isRetweeted: false,
        uuid: uuidv4()
        })
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){

       let nbLikes = localStorage.getItem(`nbLikes-${tweet.uuid}`)
       let nbRetweets = localStorage.getItem(`nbRetweets-${tweet.uuid}`)
       let nbReplies = localStorage.getItem(`nbReplies-${tweet.uuid}`)
        
        let likeIconClass = ''
        let likeIconFill = 'regular'
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
            likeIconFill = 'solid'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let replyIconClass = ''
        
        if (tweet.isReplied){
            replyIconClass = 'replied'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>

`
            })
        }
        
        let areaToReply = `
                            <div class="reply">
                                <div class="tweet-reply">
                                        <img src="images/scrimbalogo.png" class="profile-pic">
                                        <textarea placeholder="Reply the tweet..." id="textearea-${tweet.uuid}"></textarea>
                                    </div>
                                    <button class="btn-reply" id="reply-btn" data-replybtn="${tweet.uuid}">Tweet</button>
                            </div>
        `
        
          
        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i id="replyIcon" class="fa-regular fa-comment-dots ${replyIconClass}"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${nbReplies}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${nbRetweets}
                </span>
                <span class="tweet-detail">
                    <i class="fa-${likeIconFill} fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${nbLikes}
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        ${areaToReply}
    </div>   
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
}

render()

