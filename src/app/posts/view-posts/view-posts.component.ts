import { Subscription } from 'rxjs';
import { PostsService } from './../posts.service';
import { Post } from './../post.model';
import { Component, OnInit, OnDestroy} from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { SafePipe } from '../../common/pipes/safe.pipe'
import { AuthService } from 'src/app/common/auth/auth.service';


@Component({
  selector: 'view-posts',
  templateUrl: './view-posts.component.html',
  styleUrls: ['./view-posts.component.css'],
})
export class ViewPostsComponent implements OnInit, OnDestroy {
  userIsAuthenticated = false

  posts:Post[] = []
  private postSub:Subscription
  private authListenerSubs: Subscription

  totalPost:number
  postPerPage:number
  currentPage:number
  pageSizeOptions = [5, 10, 25, 50, 100]

  constructor(private postsService: PostsService, private authService: AuthService){

  }

  ngOnInit(){
    this.postsService.getPosts(this.postPerPage, this.currentPage)

    //suscribing new posts
    this.postSub = this.postsService.getPostUpdated()
      .subscribe((postData) => {
        this.posts=[...postData.posts]
        this.totalPost= postData.postCount
      })

    //suscribing new auth status
    this.userIsAuthenticated = this.authService.getIsAuth()
    this.authListenerSubs = this.authService
      .getAuthStatusListener()
      .subscribe((isAuthenticated) => {
        this.userIsAuthenticated = isAuthenticated
      })
  }

  onPageChange(pageData: PageEvent){
    this.currentPage = pageData.pageIndex + 1
    this.postPerPage = pageData.pageSize
    this.postsService.getPosts(this.postPerPage, this.currentPage)
  }

  ngOnDestroy(){
    this.postSub.unsubscribe()
    this.authListenerSubs.unsubscribe()
  }

  deletePost(id){
    this.postsService.deletePost(id)
  }


}
